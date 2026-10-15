-- ============================================================================
-- ONSPOT INITIAL SCHEMA
-- Completely idempotent: safe to run multiple times in the Supabase SQL editor
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- HELPERS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT DEFAULT 'Chennai, Tamil Nadu',
  upi_id TEXT,
  role TEXT NOT NULL DEFAULT 'seeker' CHECK (role IN ('seeker', 'dealer', 'admin')),
  rating NUMERIC(2, 1) DEFAULT 5.0,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure wallet_balance column exists if table was previously created
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC(10, 2) DEFAULT 0.00;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Role lookup used by policies (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Guard profile updates: no self-promotion to admin, no direct self-edited rating
CREATE OR REPLACE FUNCTION public.guard_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    IF NEW.role = 'admin' AND OLD.role <> 'admin' THEN
      RAISE EXCEPTION 'You cannot promote yourself to admin.';
    END IF;
    IF NEW.rating IS DISTINCT FROM OLD.rating THEN
      RAISE EXCEPTION 'Rating cannot be edited directly.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_prevent_role_self_promote ON public.profiles;
DROP TRIGGER IF EXISTS trg_guard_profile_update ON public.profiles;
CREATE TRIGGER trg_guard_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_update();

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Dealers can read applicant profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or applicants of their jobs" ON public.profiles;

CREATE POLICY "Users can view own profile or applicants of their jobs"
  ON public.profiles FOR SELECT
  USING (
    (SELECT auth.uid()) = id
    OR EXISTS (
      SELECT 1
      FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      WHERE a.user_id = profiles.id
        AND j.dealer_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id AND role IN ('seeker', 'dealer'));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Clients may only edit these columns directly (role, rating, email protected)
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (name, phone, city, upi_id, avatar_url, updated_at) ON public.profiles TO authenticated;

-- Safe, public-facing view of profiles (no phone / email / upi_id)
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
  SELECT id, name, city, role, rating, avatar_url
  FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 2. JOBS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  category_display TEXT,
  title TEXT NOT NULL,
  dealer_name TEXT NOT NULL,
  dealer_rating NUMERIC(2, 1) DEFAULT 5.0,
  image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
  pay TEXT NOT NULL,
  pay_type TEXT NOT NULL DEFAULT 'Per Shift',
  raw_pay INTEGER NOT NULL DEFAULT 800,
  venue_name TEXT,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  date TEXT NOT NULL,
  date_type TEXT DEFAULT 'upcoming',
  start_at TIMESTAMPTZ DEFAULT NOW(),
  end_at TIMESTAMPTZ,
  time TEXT NOT NULL,
  reporting_time TEXT,
  duration_hours NUMERIC(3, 1),
  slots_total INTEGER NOT NULL DEFAULT 1,
  slots_filled INTEGER NOT NULL DEFAULT 0,
  urgent BOOLEAN DEFAULT FALSE,
  instant_pay BOOLEAN DEFAULT FALSE,
  gender_req TEXT DEFAULT 'any',
  perks TEXT[] DEFAULT '{}',
  requirements TEXT,
  dress_code TEXT,
  description TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure start_at and end_at exist if table already existed
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS end_at   TIMESTAMPTZ;

-- Constraints
ALTER TABLE public.jobs
  DROP CONSTRAINT IF EXISTS chk_slots_filled_lte_total,
  DROP CONSTRAINT IF EXISTS chk_raw_pay_positive,
  DROP CONSTRAINT IF EXISTS chk_slots_total_positive;

ALTER TABLE public.jobs
  ADD CONSTRAINT chk_slots_filled_lte_total CHECK (slots_filled <= slots_total),
  ADD CONSTRAINT chk_raw_pay_positive       CHECK (raw_pay > 0),
  ADD CONSTRAINT chk_slots_total_positive   CHECK (slots_total > 0);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS jobs_set_updated_at ON public.jobs;
CREATE TRIGGER jobs_set_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Jobs policies
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone"
  ON public.jobs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Dealers can insert jobs" ON public.jobs;
CREATE POLICY "Dealers can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    (SELECT auth.uid()) = dealer_id
    AND public.get_my_role() IN ('dealer', 'admin')
  );

DROP POLICY IF EXISTS "Dealers can update their own jobs" ON public.jobs;
CREATE POLICY "Dealers can update their own jobs"
  ON public.jobs FOR UPDATE
  USING ((SELECT auth.uid()) = dealer_id)
  WITH CHECK ((SELECT auth.uid()) = dealer_id);

DROP POLICY IF EXISTS "Dealers can delete their own jobs" ON public.jobs;
CREATE POLICY "Dealers can delete their own jobs"
  ON public.jobs FOR DELETE
  USING ((SELECT auth.uid()) = dealer_id);

-- ----------------------------------------------------------------------------
-- 3. APPLICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Accepted', 'Declined', 'Completed', 'Cancelled')),
  payment_id TEXT,
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Ensure notes column exists if table already existed
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications policies
DROP POLICY IF EXISTS "Users can view their own applications or dealers can view applicants for their jobs" ON public.applications;
CREATE POLICY "Users can view their own applications or dealers can view applicants for their jobs"
  ON public.applications FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND jobs.dealer_id = (SELECT auth.uid())
    )
  );

-- Applicants can only create an application in 'Applied' state, for an active open job
DROP POLICY IF EXISTS "Users can apply for shifts" ON public.applications;
CREATE POLICY "Users can apply for shifts"
  ON public.applications FOR INSERT
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND status = 'Applied'
    AND EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_id
        AND jobs.status = 'active'
        AND jobs.slots_filled < jobs.slots_total
    )
  );

DROP POLICY IF EXISTS "Users or dealers can update applications" ON public.applications;
DROP POLICY IF EXISTS "Applicants can cancel own application" ON public.applications;
DROP POLICY IF EXISTS "Applicants can update their own applications" ON public.applications;
CREATE POLICY "Applicants can update their own applications"
  ON public.applications FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Dealers can update application status" ON public.applications;
DROP POLICY IF EXISTS "Dealers can update applications for their jobs" ON public.applications;
CREATE POLICY "Dealers can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND jobs.dealer_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND jobs.dealer_id = (SELECT auth.uid())
    )
  );

-- Field-level rules for application updates
CREATE OR REPLACE FUNCTION public.guard_application_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.job_id <> OLD.job_id OR NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'job_id and user_id cannot be changed';
  END IF;

  IF auth.uid() = OLD.user_id THEN
    IF NEW.status <> OLD.status AND NEW.status <> 'Cancelled' THEN
      RAISE EXCEPTION 'Applicants can only cancel their application';
    END IF;
    IF NEW.payment_id IS DISTINCT FROM OLD.payment_id AND OLD.payment_id IS NOT NULL THEN
      RAISE EXCEPTION 'payment_id cannot be changed once set';
    END IF;
  ELSE
    IF NEW.payment_id IS DISTINCT FROM OLD.payment_id THEN
      RAISE EXCEPTION 'Dealers cannot change payment_id';
    END IF;
    IF NEW.status <> OLD.status AND NEW.status IN ('Applied', 'Cancelled') THEN
      RAISE EXCEPTION 'Dealers can only set Under Review, Accepted, Declined or Completed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS applications_guard_update ON public.applications;
CREATE TRIGGER applications_guard_update
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.guard_application_update();

-- Atomic slot counting trigger
CREATE OR REPLACE FUNCTION public.handle_application_slots()
RETURNS TRIGGER AS $$
DECLARE
  v_job         RECORD;
  v_old_counted BOOLEAN;
  v_new_counted BOOLEAN;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT status, slots_total, slots_filled
    INTO v_job
    FROM public.jobs
    WHERE id = NEW.job_id
    FOR UPDATE;

    IF v_job.status <> 'active' THEN
      RAISE EXCEPTION 'This job is no longer accepting applications.';
    END IF;

    IF v_job.slots_filled >= v_job.slots_total THEN
      RAISE EXCEPTION 'All slots for this job are already filled.';
    END IF;

    UPDATE public.jobs
    SET slots_filled = slots_filled + 1
    WHERE id = NEW.job_id;

    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_old_counted := OLD.status NOT IN ('Cancelled', 'Declined');
    v_new_counted := NEW.status NOT IN ('Cancelled', 'Declined');

    IF v_old_counted AND NOT v_new_counted THEN
      UPDATE public.jobs
      SET slots_filled = GREATEST(0, slots_filled - 1)
      WHERE id = NEW.job_id;

    ELSIF NOT v_old_counted AND v_new_counted THEN
      SELECT slots_total, slots_filled
      INTO v_job
      FROM public.jobs
      WHERE id = NEW.job_id
      FOR UPDATE;

      IF v_job.slots_filled >= v_job.slots_total THEN
        RAISE EXCEPTION 'All slots for this job are already filled.';
      END IF;

      UPDATE public.jobs
      SET slots_filled = slots_filled + 1
      WHERE id = NEW.job_id;
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD.status NOT IN ('Cancelled', 'Declined') THEN
      UPDATE public.jobs
      SET slots_filled = GREATEST(0, slots_filled - 1)
      WHERE id = OLD.job_id;
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_application_slots ON public.applications;
CREATE TRIGGER trg_application_slots
  AFTER INSERT OR DELETE OR UPDATE OF status ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_application_slots();

-- ----------------------------------------------------------------------------
-- 4. SAVED JOBS (BOOKMARKS) TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own saved jobs" ON public.saved_jobs;
CREATE POLICY "Users can view their own saved jobs"
  ON public.saved_jobs FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can save jobs" ON public.saved_jobs;
CREATE POLICY "Users can save jobs"
  ON public.saved_jobs FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their saved jobs" ON public.saved_jobs;
CREATE POLICY "Users can delete their saved jobs"
  ON public.saved_jobs FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- 5. MESSAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;
CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT
  USING ((SELECT auth.uid()) = sender_id OR (SELECT auth.uid()) = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    (SELECT auth.uid()) = sender_id
    AND receiver_id IS NOT NULL
    AND receiver_id <> sender_id
  );

DROP POLICY IF EXISTS "Receivers can update message read status" ON public.messages;
CREATE POLICY "Receivers can update message read status"
  ON public.messages FOR UPDATE
  USING ((SELECT auth.uid()) = receiver_id)
  WITH CHECK ((SELECT auth.uid()) = receiver_id);

-- Receivers may flip "read" only
REVOKE UPDATE ON public.messages FROM anon, authenticated;
GRANT UPDATE (read) ON public.messages TO authenticated;

-- Guard message updates: only read may change
CREATE OR REPLACE FUNCTION public.guard_message_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id              IS DISTINCT FROM OLD.id
     OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
     OR NEW.sender_id       IS DISTINCT FROM OLD.sender_id
     OR NEW.receiver_id     IS DISTINCT FROM OLD.receiver_id
     OR NEW.message         IS DISTINCT FROM OLD.message
     OR NEW.created_at      IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Only the read status of a message can be changed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_guard_message_update ON public.messages;
CREATE TRIGGER trg_guard_message_update
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.guard_message_update();

-- ----------------------------------------------------------------------------
-- 6. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'job_alert',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can mark their notifications read" ON public.notifications;
CREATE POLICY "Users can mark their notifications read"
  ON public.notifications FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (false);

-- Only mark is_read
REVOKE UPDATE ON public.notifications FROM anon, authenticated;
GRANT UPDATE (is_read) ON public.notifications TO authenticated;

-- Helper to create notification safely
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type    TEXT,
  p_title   TEXT,
  p_message TEXT,
  p_job_id  UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, job_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_job_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.create_notification(UUID, TEXT, TEXT, TEXT, UUID)
  FROM PUBLIC, anon, authenticated;

-- Trigger to notify on application insert / update
CREATE OR REPLACE FUNCTION public.handle_notify_on_application()
RETURNS TRIGGER AS $$
DECLARE
  v_job     RECORD;
  v_profile RECORD;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT dealer_id, title INTO v_job FROM public.jobs WHERE id = NEW.job_id;
    SELECT name INTO v_profile FROM public.profiles WHERE id = NEW.user_id;

    IF v_job.dealer_id IS NOT NULL THEN
      PERFORM public.create_notification(
        v_job.dealer_id,
        'new_application',
        'New Application Received',
        COALESCE(v_profile.name, 'Someone') || ' applied for your job: ' || COALESCE(v_job.title, 'a job'),
        NEW.job_id
      );
    END IF;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM public.create_notification(
      NEW.user_id,
      'status_update',
      'Application Update',
      'Your application status changed to: ' || NEW.status,
      NEW.job_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_application ON public.applications;
CREATE TRIGGER trg_notify_application
  AFTER INSERT OR UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_notify_on_application();

-- ----------------------------------------------------------------------------
-- 7. AUTH TRIGGER: AUTOMATIC PROFILE CREATION ON USER SIGNUP
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    phone,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('seeker', 'dealer')
        THEN NEW.raw_user_meta_data->>'role'
      ELSE 'seeker'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 8. INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_jobs_dealer_id ON public.jobs(dealer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status_start_at ON public.jobs(status, start_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON public.jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read ON public.notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- 9. REALTIME PUBLICATION (skips tables that are already published)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['jobs', 'messages', 'applications', 'notifications'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;