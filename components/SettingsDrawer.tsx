'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function SettingsDrawer() {
  const {
    isSettingsDrawerOpen,
    closeSettingsDrawer,
    theme,
    setTheme,
    userRole,
    setUserRole,
    userProfile,
    openModal,
    logout,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');

  const q = searchQuery.toLowerCase().trim();

  const matchesQuery = (keywords: string, title: string) => {
    if (!q) return true;
    return keywords.toLowerCase().includes(q) || title.toLowerCase().includes(q);
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isSettingsDrawerOpen ? 'open' : ''}`}
        id="settings-backdrop"
        onClick={closeSettingsDrawer}
      />
      <aside className={`settings-drawer ${isSettingsDrawerOpen ? 'open' : ''}`} id="settings-drawer">
        <div className="settings-header">
          <button className="btn-back-settings" onClick={closeSettingsDrawer}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="settings-title-area">
            <h2>⚙️ Settings</h2>
            <p>Manage your account, preferences and privacy</p>
          </div>
        </div>

        <div className="settings-body">
          <div className="settings-search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              id="settings-search-input"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* APPEARANCE */}
          {matchesQuery('theme appearance dark light mode color', 'Appearance') && (
            <div className="settings-group" data-keywords="theme appearance dark light mode color">
              <div className="settings-group-title">Appearance</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => setTheme('dark')}>
                  <div className="settings-icon">🌙</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Dark Mode</div>
                    <div className="settings-info-desc">Obsidian dark theme (Default)</div>
                  </div>
                  {theme === 'dark' && (
                    <div className="settings-action" id="check-dark">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--mint-primary)"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="settings-row" onClick={() => setTheme('light')}>
                  <div className="settings-icon">☀️</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Light Mode</div>
                    <div className="settings-info-desc">Clean, professional light interface</div>
                  </div>
                  {theme === 'light' && (
                    <div className="settings-action" id="check-light">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--mint-primary)"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {matchesQuery('account edit profile email phone password verification type switch logout', 'Account Settings') && (
            <div className="settings-group" data-keywords="account edit profile email phone password verification type switch logout">
              <div className="settings-group-title">Account Settings</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('profile-modal'); }}>
                  <div className="settings-icon">👤</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Edit Profile</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">📧</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Email Address</div>
                    <div className="settings-info-desc">{userProfile.email}</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">📱</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Phone Number</div>
                    <div className="settings-info-desc">{userProfile.phone}</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => showToast('Password management available in account settings')}>
                  <div className="settings-icon">🔐</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Change Password</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">🪪</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Identity Verification / KYC</div>
                    <div className="settings-info-desc">Aadhar &amp; Biometrics</div>
                  </div>
                  <div className="settings-val">Verified</div>
                </div>
                <div
                  className="settings-row"
                  onClick={() => {
                    const nextRole = userRole === 'seeker' ? 'dealer' : 'seeker';
                    setUserRole(nextRole);
                    closeSettingsDrawer();
                    showToast(`Switched account mode to ${nextRole === 'dealer' ? 'Dealer' : 'Job Seeker'}`);
                  }}
                >
                  <div className="settings-icon">🔄</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Switch Account Type</div>
                    <div className="settings-info-desc">Switch to {userRole === 'seeker' ? 'Dealer' : 'Job Seeker'}</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {matchesQuery('profile photo bio address work location date of birth gender contact', 'Profile Settings') && (
            <div className="settings-group" data-keywords="profile photo bio address work location date of birth gender contact">
              <div className="settings-group-title">Profile Settings</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('camera-modal'); }}>
                  <div className="settings-icon">📸</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Change Profile Photo</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('profile-modal'); }}>
                  <div className="settings-icon">📝</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Edit Bio</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">📍</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Work Location</div>
                    <div className="settings-info-desc">{userProfile.city}</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">🎂</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Date of Birth</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">👤</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Gender</div>
                    <div className="settings-info-desc">Male</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* JOB PREFERENCES */}
          {matchesQuery('job preferences categories work location radius pay working hours days instant meals transportation', 'Job Preferences') && (
            <div className="settings-group" data-keywords="job preferences categories work location radius pay working hours days instant meals transportation">
              <div className="settings-group-title">Job Preferences</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('filter-modal'); }}>
                  <div className="settings-icon">💼</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Job Categories</div>
                  </div>
                  <div className="settings-val">3 selected</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('filter-modal'); }}>
                  <div className="settings-icon">📏</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Job Search Radius</div>
                  </div>
                  <div className="settings-val">10 km</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">💰</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Min Expected Pay</div>
                  </div>
                  <div className="settings-val">₹500</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">⚡</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Instant Pay Only</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="pref-instant" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">🍱</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Meals Provided</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="pref-meals" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {matchesQuery('notification job alerts message payment shift reminder urgent recommended promotional security', 'Notifications') && (
            <div className="settings-group" data-keywords="notification job alerts message payment shift reminder urgent recommended promotional security">
              <div className="settings-group-title">Notifications</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div className="settings-icon">🔔</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Job Alerts</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="notif-job" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">💬</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Message Notifications</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="notif-msg" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">💰</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Payment Notifications</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="notif-pay" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">📅</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Shift Reminders</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="notif-shift" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">⚡</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Urgent Job Alerts</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="notif-urgent" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {matchesQuery('privacy visibility location sharing phone email online active status', 'Privacy') && (
            <div className="settings-group" data-keywords="privacy visibility location sharing phone email online active status">
              <div className="settings-group-title">Privacy</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div className="settings-icon">👁️</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Profile Visibility</div>
                    <div className="settings-info-desc">Who can see your profile</div>
                  </div>
                  <div className="settings-val">Verified Dealers</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">📍</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Location Sharing</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="priv-loc" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">🟢</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Online Status</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="priv-online" defaultChecked onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {matchesQuery('security password two factor authentication login devices activity active sessions logout devices', 'Security') && (
            <div className="settings-group" data-keywords="security password two factor authentication login devices activity active sessions logout devices">
              <div className="settings-group-title">Security</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div className="settings-icon">🛡️</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Two-Factor Authentication</div>
                  </div>
                  <div className="settings-val">Enabled</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">📱</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Login Devices</div>
                    <div className="settings-info-desc">2 active sessions</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {matchesQuery('payment methods upi id bank account history transaction download statement', 'Payments') && (
            <div className="settings-group" data-keywords="payment methods upi id bank account history transaction download statement">
              <div className="settings-group-title">Payments</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('profile-modal'); }}>
                  <div className="settings-icon">💳</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Payment Methods</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('profile-modal'); }}>
                  <div className="settings-icon">📱</div>
                  <div className="settings-info">
                    <div className="settings-info-title">UPI ID</div>
                    <div className="settings-info-desc">{userProfile.upiId}</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => showToast('No pending transactions')}>
                  <div className="settings-icon">🧾</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Transaction History</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGE */}
          {matchesQuery('language english tamil hindi telugu kannada malayalam', 'Language') && (
            <div className="settings-group" data-keywords="language english tamil hindi telugu kannada malayalam">
              <div className="settings-group-title">Language</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { setSelectedLang('en'); showToast('Language set to English'); }}>
                  <div className="settings-icon">🇬🇧</div>
                  <div className="settings-info">
                    <div className="settings-info-title">English</div>
                  </div>
                  {selectedLang === 'en' && (
                    <div className="settings-action" id="check-lang-en">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mint-primary)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="settings-row" onClick={() => { setSelectedLang('ta'); showToast('Language set to Tamil'); }}>
                  <div className="settings-icon">🇮🇳</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Tamil</div>
                  </div>
                  {selectedLang === 'ta' && (
                    <div className="settings-action" id="check-lang-ta">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mint-primary)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="settings-row" onClick={() => { setSelectedLang('hi'); showToast('Language set to Hindi'); }}>
                  <div className="settings-icon">🇮🇳</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Hindi</div>
                  </div>
                  {selectedLang === 'hi' && (
                    <div className="settings-action" id="check-lang-hi">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mint-primary)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY */}
          {matchesQuery('accessibility text size high contrast animations reduce', 'Accessibility') && (
            <div className="settings-group" data-keywords="accessibility text size high contrast animations reduce">
              <div className="settings-group-title">Accessibility</div>
              <div className="settings-card">
                <div className="settings-row">
                  <div className="settings-icon">🔤</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Text Size</div>
                  </div>
                  <div className="settings-val">Medium</div>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">🎨</div>
                  <div className="settings-info">
                    <div className="settings-info-title">High Contrast</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="acc-contrast" onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <div className="settings-icon">✨</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Reduce Animations</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="acc-anim" onChange={() => showToast('Preference saved')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* DATA & ACTIVITY */}
          {matchesQuery('data activity applied saved viewed jobs download clear search history', 'Your Activity') && (
            <div className="settings-group" data-keywords="data activity applied saved viewed jobs download clear search history">
              <div className="settings-group-title">Your Activity</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); }}>
                  <div className="settings-icon">📋</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Applied Jobs</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); }}>
                  <div className="settings-icon">⭐</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Saved Jobs</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => showToast('Search history cleared!')}>
                  <div className="settings-icon">🧹</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Clear Search History</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* SAFETY / BLOCKED DEALERS */}
          {matchesQuery('safety blocked dealers report problem center', 'Safety') && (
            <div className="settings-group" data-keywords="safety blocked dealers report problem center">
              <div className="settings-group-title">Safety</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => showToast('No blocked dealers. Dealers you block will appear here.')}>
                  <div className="settings-icon">🚫</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Blocked Dealers</div>
                    <div className="settings-info-desc">No blocked dealers</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('support-modal'); }}>
                  <div className="settings-icon">⚠️</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Report a Dealer</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* HELP & SUPPORT */}
          {matchesQuery('help support contact center problem feedback faq', 'Help & Support') && (
            <div className="settings-group" data-keywords="help support contact center problem feedback faq">
              <div className="settings-group-title">Help &amp; Support</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('support-modal'); }}>
                  <div className="settings-icon">❓</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Help Center</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('support-modal'); }}>
                  <div className="settings-icon">💬</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Contact Support</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* LEGAL */}
          {matchesQuery('legal terms conditions privacy policy user safety dealer payment refund community guidelines cookie', 'Legal') && (
            <div className="settings-group" data-keywords="legal terms conditions privacy policy user safety dealer payment refund community guidelines cookie">
              <div className="settings-group-title">Legal</div>
              <div className="settings-card">
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('legal-modal'); }}>
                  <div className="settings-icon">📄</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Terms &amp; Conditions</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('legal-modal'); }}>
                  <div className="settings-icon">🔐</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Privacy Policy</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
                <div className="settings-row" onClick={() => { closeSettingsDrawer(); openModal('legal-modal'); }}>
                  <div className="settings-icon">💰</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Payment &amp; Refund Policy</div>
                  </div>
                  <div className="settings-action">&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT MANAGEMENT */}
          {matchesQuery('account management logout deactivate delete', 'Account Management') && (
            <div className="settings-group" data-keywords="account management logout deactivate delete">
              <div className="settings-group-title">Account Management</div>
              <div className="settings-card">
                <div className="settings-row" onClick={logout}>
                  <div className="settings-icon">🚪</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Logout</div>
                  </div>
                </div>
                <div className="settings-row danger" onClick={() => { closeSettingsDrawer(); openModal('delete-account-modal'); }}>
                  <div className="settings-icon">🗑️</div>
                  <div className="settings-info">
                    <div className="settings-info-title">Delete Account</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ height: '60px' }} />
        </div>
      </aside>
    </>
  );
}
