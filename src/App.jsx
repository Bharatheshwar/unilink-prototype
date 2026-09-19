import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent Project Feed State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('unilink_projects');
    return saved ? JSON.parse(saved) : [
      {
        id: 'p1',
        title: 'Autonomous Rover v2',
        author: 'Alex Rivera',
        dept: 'Dept of MechE • Robotics Guild',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        desc: 'Stereoscopic LiDAR point cloud rig calibrated across 4 university testing grounds with ROS2 nodes.',
        likes: 142
      },
      {
        id: 'p2',
        title: 'Genomic LLM Pipeline',
        author: 'Maya Patel',
        dept: 'Biomedical Informatics Lab',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
        desc: 'Cross-campus distributed transformers for accelerating rare protein mutation alignment.',
        likes: 89
      }
    ];
  });

  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('unilink_liked_posts');
    return saved ? JSON.parse(saved) : {};
  });

  // Persistent Chat Messages
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('unilink_chat');
    return saved ? JSON.parse(saved) : [
      { user: 'Sarah Lin', campus: 'MIT', text: 'Anyone forming an AI hackathon team? 💻' },
      { user: 'Marcus Vance', campus: 'Stanford', text: 'Need 1 frontend engineer with React skills!' },
      { user: 'Elena Rostova', campus: 'Berkeley', text: 'Keynote audio is super clear today!' }
    ];
  });
  const [chatInput, setChatInput] = useState('');

  // Persistent Forum Posts
  const [forumPosts, setForumPosts] = useState(() => {
    const saved = localStorage.getItem('unilink_forums');
    return saved ? JSON.parse(saved) : [
      { author: 'Engineering Dept • 2h ago', text: 'Cross-campus robotics lab open for calibration testing.' },
      { author: 'Biotech Lab • 5h ago', text: 'Looking for ML co-authors on genomic alignment project.' }
    ];
  });
  const [forumInput, setForumInput] = useState('');

  // RSVP State
  const [rsvpdEvents, setRsvpdEvents] = useState({});

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('unilink_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('unilink_liked_posts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    localStorage.setItem('unilink_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('unilink_forums', JSON.stringify(forumPosts));
  }, [forumPosts]);

  // UI Interactive States
  const [activeSpeaker, setActiveSpeaker] = useState('Keynote Host');
  const [eventCategory, setEventCategory] = useState('All');
  const [selectedMapPin, setSelectedMapPin] = useState(null);

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [reviewsList, setReviewsList] = useState([
    { author: 'Dr. Michael Chen', role: 'DeepMind Mentor', stars: 5, text: 'Solid LiDAR point cloud processing. Consider benchmarking power draw under continuous outdoor navigation.' },
    { author: 'Liam K.', role: 'Robotics Lead', stars: 4, text: 'Clean motor driver PCB. Would love to collaborate on the ROS2 stack.' }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDept, setNewProjectDept] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamJoinStatus, setTeamJoinStatus] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  // Handlers
  const toggleLike = (id) => {
    const isLiked = likedPosts[id];
    setProjects(prev => prev.map(p => p.id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p));
    setLikedPosts(prev => ({ ...prev, [id]: !isLiked }));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { user: 'Alex Rivera', campus: 'You', text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleAddForumPost = (e) => {
    e.preventDefault();
    if (!forumInput.trim()) return;
    setForumPosts(prev => [{ author: 'Alex Rivera • Just now', text: forumInput.trim() }, ...prev]);
    setForumInput('');
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    const newEntry = {
      id: `p-${Date.now()}`,
      title: newProjectTitle.trim(),
      author: 'Alex Rivera',
      dept: newProjectDept.trim() || 'Computer Science & AI Hub',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      desc: newProjectDesc.trim() || 'Excited to publish this new inter-campus initiative on UniLink!',
      likes: 1
    };
    setProjects([newEntry, ...projects]);
    setNewProjectTitle('');
    setNewProjectDept('');
    setNewProjectDesc('');
    setShowCreateModal(false);
  };

  const handleScanCard = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
    }, 1500);
  };

  const toggleRsvp = (id) => {
    setRsvpdEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const eventsData = [
    { id: 1, title: 'Fullstack Next.js Sprint', type: 'Workshops', time: 'Today • 4:00 PM', hall: 'Hall 4B', pin: 'Mech Lab', attendees: 48 },
    { id: 2, title: 'Inter-College Mixer & Pitch Night', type: 'Social', time: 'Today • 6:30 PM', hall: 'Student Hub', pin: 'Social Lawn', attendees: 112 },
    { id: 3, title: 'Alumni Keynote: LLMs in Biotech', type: 'Lectures', time: 'Tomorrow • 11:00 AM', hall: 'Auditorium', pin: 'AI Lecture', attendees: 85 }
  ];

  const networkData = [
    { name: 'Computer Science', icon: '💻', count: '18 Labs' },
    { name: 'Robotics & Swarms', icon: '⚙️', count: '12 Teams' },
    { name: 'Biomedical Cohorts', icon: '🧬', count: '9 Cohorts' },
    { name: 'Founders Guild', icon: '📈', count: '21 Startups' }
  ];

  const cleanQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = projects.filter(p => 
    !cleanQuery ||
    p.title.toLowerCase().includes(cleanQuery) || 
    p.dept.toLowerCase().includes(cleanQuery) ||
    p.author.toLowerCase().includes(cleanQuery) ||
    p.desc.toLowerCase().includes(cleanQuery)
  );

  const filteredEvents = eventsData.filter(ev => {
    const matchesCat = eventCategory === 'All' || ev.type === eventCategory;
    const matchesPin = !selectedMapPin || ev.pin === selectedMapPin;
    const matchesSearch = !cleanQuery || 
      ev.title.toLowerCase().includes(cleanQuery) ||
      ev.type.toLowerCase().includes(cleanQuery) ||
      ev.hall.toLowerCase().includes(cleanQuery) ||
      ev.pin.toLowerCase().includes(cleanQuery);
    return matchesCat && matchesPin && matchesSearch;
  });

  const filteredNetwork = networkData.filter(dept =>
    !cleanQuery || dept.name.toLowerCase().includes(cleanQuery)
  );

  return (
    <div className="unilink-app">
      <div className="app-shell">

        {/* Left Navigation Sidebar */}
        <aside className="sidebar-left">
          <div className="brand-header">
            <div className="brand-title">
              <span>🎓</span> UniLink
            </div>
            <span className="brand-subtitle">Multi-Campus Ecosystem</span>
          </div>

          {[
            { id: 'feed', name: 'Campus Feed', icon: '🏠' },
            { id: 'network', name: 'Connections Network', icon: '🌐' },
            { id: 'events', name: 'Event Map & Calendar', icon: '📅' },
            { id: 'profile', name: 'Student Profile', icon: '👤' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}

          {/* Persistent Student Card */}
          <div className="sidebar-badge-card">
            {isScanning && <div className="scanner-line"></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>Alex Rivera</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>NFC ID: #UK-9841</div>
              </div>
              <span style={{ fontSize: '18px' }}>💳</span>
            </div>
            <button 
              onClick={handleScanCard}
              disabled={isScanning}
              className={isVerified ? 'badge-verified' : 'badge-unverified'}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '6px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {isScanning ? 'NFC Scanning...' : (isVerified ? 'Campus ID Active ✓' : 'Tap to Verify')}
            </button>
          </div>
        </aside>

        {/* Main Feed Column */}
        <main className="main-content">
          <header className="top-header">
            <div>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#1e3a8a' }}>🎓 UniLink</div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Multi-Campus Live Feed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={isVerified ? 'badge-verified' : 'badge-unverified'}>
                {isVerified ? 'ID Verified ✓' : 'Unverified'}
              </span>
              <button style={{ border: 'none', background: 'none', fontSize: '16px', cursor: 'pointer' }} onClick={() => alert('Notifications: 2 new project invites')}>🔔</button>
            </div>
          </header>

          <div className="feed-container">
            {/* Universal Search Filter Bar */}
            <input 
              type="text"
              placeholder="🔍 Search across projects, topics, authors, or campus events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-box"
            />

            {/* TAB 1: FEED */}
            {activeTab === 'feed' && (
              <>
                {!cleanQuery && (
                  <>
                    <div className="story-bar no-scrollbar">
                      {[
                        { name: 'Your Feed', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
                        { name: 'MIT Lab', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
                        { name: 'Stanford AI', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
                        { name: 'Robotics', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
                        { name: 'BioTech', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' }
                      ].map((s, i) => (
                        <div key={i} className="story-item">
                          <img src={s.img} alt={s.name} className="story-img-circle" />
                          <span className="story-label">{s.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live Hackathon Card */}
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge-live"><span className="live-dot"></span> Live Hackathon</span>
                        <button 
                          onClick={() => setShowTeamModal(true)}
                          style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          🤝 Find Teammate (3/4)
                        </button>
                      </div>
                      <h3 style={{ fontSize: '15px', color: '#0f172a', margin: '4px 0 6px 0' }}>Global Inter-Campus AI Sprint</h3>
                      
                      {/* Speaker Grid */}
                      <div className="speaker-grid">
                        {[
                          { name: 'Team Alpha (MIT)', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80' },
                          { name: 'Hardware Node', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80' },
                          { name: 'Keynote Host', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80' },
                          { name: 'Elena (Berkeley)', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
                          { name: 'Robotics Lab', img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80' },
                          { name: 'Design Swarm', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&auto=format&fit=crop&q=80' }
                        ].map((sp, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setActiveSpeaker(sp.name)}
                            className="speaker-tile"
                            style={{ 
                              backgroundImage: `url(${sp.img})`,
                              border: activeSpeaker === sp.name ? '2px solid #3b82f6' : '1px solid #334155' 
                            }}
                          >
                            <div className="speaker-overlay"></div>
                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span style={{ color: activeSpeaker === sp.name ? '#60a5fa' : '#fff', fontSize: '8px', fontWeight: '700' }}>{sp.name}</span>
                              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '12px' }}>
                                <div className="eq-bar"></div>
                                <div className="eq-bar" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Section */}
                      <div className="chat-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Live Stream Chat</span>
                          <span style={{ fontSize: '10px', color: '#2563eb' }}>Focus: {activeSpeaker}</span>
                        </div>

                        <div className="no-scrollbar" style={{ maxHeight: '75px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {chatMessages.map((msg, i) => (
                            <div key={i} style={{ fontSize: '11px', color: '#1e293b' }}>
                              <strong style={{ color: msg.campus === 'You' ? '#2563eb' : '#0f172a' }}>{msg.user} ({msg.campus}): </strong>
                              {msg.text}
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                          <input 
                            type="text" 
                            placeholder="Live chat or find teammates..." 
                            value={chatInput} 
                            onChange={(e) => setChatInput(e.target.value)} 
                            className="chat-input"
                          />
                          <button type="submit" className="chat-send-btn">Send</button>
                        </form>
                      </div>
                    </div>
                  </>
                )}

                {/* Filtered Dynamic Project Showcase Cards */}
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj) => (
                    <div key={proj.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <img src={proj.avatar} alt={proj.author} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '13px' }}>{proj.title}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{proj.author} • {proj.dept}</div>
                          </div>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '16px' }}>•••</span>
                      </div>

                      <img src={proj.image} alt={proj.title} className="project-img-banner" />
                      <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4', marginBottom: '8px' }}>{proj.desc}</p>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => toggleLike(proj.id)}
                          className="action-btn"
                          style={{ color: likedPosts[proj.id] ? '#ef4444' : '#475569' }}
                        >
                          {likedPosts[proj.id] ? '❤️' : '🤍'} {proj.likes} Likes
                        </button>
                        <button 
                          onClick={() => setShowReviewModal(true)}
                          className="action-btn"
                          style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                        >
                          📝 Peer Reviews ({reviewsList.length})
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '13px' }}>
                    No projects found matching "{searchQuery}"
                  </div>
                )}
              </>
            )}

            {/* TAB 2: NETWORK */}
            {activeTab === 'network' && (
              <>
                <div>
                  <h3 style={{ fontSize: '17px', color: '#0f172a' }}>University Connections Network</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Inter-college research labs, student orgs & alumni mentors.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {filteredNetwork.map((dept, idx) => (
                    <div key={idx} className="card">
                      <div style={{ fontSize: '20px' }}>{dept.icon}</div>
                      <div style={{ fontWeight: '700', fontSize: '12px', marginTop: '4px' }}>{dept.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{dept.count}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB 3: EVENTS */}
            {activeTab === 'events' && (
              <>
                <div>
                  <h3 style={{ fontSize: '17px', color: '#0f172a' }}>Campus Event Map</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Tap pins to reveal live occupancy and schedule.</p>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['All', 'Workshops', 'Social', 'Lectures'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setEventCategory(cat); setSelectedMapPin(null); }}
                      style={{
                        flex: 1,
                        padding: '5px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        backgroundColor: eventCategory === cat && !selectedMapPin ? '#2563eb' : '#e2e8f0',
                        color: eventCategory === cat && !selectedMapPin ? '#fff' : '#334155'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="map-container">
                  <div className="map-grid">
                    <div 
                      onClick={() => setSelectedMapPin(selectedMapPin === 'Mech Lab' ? null : 'Mech Lab')}
                      className="map-pin"
                      style={{ top: '25%', left: '20%', border: selectedMapPin === 'Mech Lab' ? '2px solid #2563eb' : 'none' }}
                    >
                      📍 Mech Lab
                    </div>
                    <div 
                      onClick={() => setSelectedMapPin(selectedMapPin === 'Social Lawn' ? null : 'Social Lawn')}
                      className="map-pin"
                      style={{ top: '55%', left: '55%', border: selectedMapPin === 'Social Lawn' ? '2px solid #2563eb' : 'none' }}
                    >
                      📍 Social Lawn
                    </div>
                    <div 
                      onClick={() => setSelectedMapPin(selectedMapPin === 'AI Lecture' ? null : 'AI Lecture')}
                      className="map-pin"
                      style={{ top: '72%', left: '25%', border: selectedMapPin === 'AI Lecture' ? '2px solid #2563eb' : 'none' }}
                    >
                      📍 AI Lecture
                    </div>
                  </div>
                  
                  {selectedMapPin && (
                    <div className="map-floating-info">
                      <strong>{selectedMapPin} Active Hub</strong>
                      <div style={{ fontSize: '10px', color: '#475569' }}>Occupancy: 84% • 5 min walking transit</div>
                    </div>
                  )}
                  
                  {!selectedMapPin && <span className="map-caption">🗺️ Tap any pin to lock focus</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((ev) => (
                      <div key={ev.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '9px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 5px', borderRadius: '4px' }}>{ev.type}</span>
                          <div style={{ fontWeight: '600', fontSize: '13px', marginTop: '3px' }}>{ev.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{ev.time} • {ev.hall} • {ev.attendees + (rsvpdEvents[ev.id] ? 1 : 0)} Checked in</div>
                        </div>
                        <button 
                          onClick={() => toggleRsvp(ev.id)}
                          style={{
                            backgroundColor: rsvpdEvents[ev.id] ? '#10b981' : '#0f172a',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {rsvpdEvents[ev.id] ? 'RSVP Confirmed ✓' : 'RSVP (Reserve)'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '12px' }}>
                      No events matching your filter criteria.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 4: PROFILE */}
            {activeTab === 'profile' && (
              <>
                <div className="profile-header-card">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80" 
                    alt="Alex Rivera" 
                    className="profile-avatar-big" 
                  />
                  <h3 style={{ margin: '8px 0 2px 0' }}>Alex Rivera</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Computer Engineering • Year 3</span>
                  
                  <div style={{ marginTop: '10px' }}>
                    <div className="student-id-pill">
                      Student ID: #UK-9841-B • {isVerified ? '✅ Active' : '❌ Unverified'}
                    </div>
                    <button 
                      onClick={handleScanCard} 
                      disabled={isScanning}
                      className="verify-action-btn"
                    >
                      {isScanning ? 'Scanning Card Beam...' : 'Simulate NFC Badge Scan'}
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>Skills Marketplace</h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['React', 'Python', 'System Architecture', 'UI/UX Design', 'SQL'].map((skill, idx) => (
                      <span key={idx} className="tag-skill">{skill}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        </main>

        {/* Right Desktop Sidebar */}
        <aside className="sidebar-right">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '13px' }}>Discussion Forums</strong>
              <span style={{ fontSize: '11px', color: '#2563eb' }}>Multi-Campus</span>
            </div>

            <div className="no-scrollbar" style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {forumPosts.map((p, idx) => (
                <div key={idx} style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>{p.author}</span>
                  <p style={{ fontSize: '11px', color: '#1e293b', marginTop: '2px' }}>{p.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddForumPost} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Post to campus forum..."
                value={forumInput}
                onChange={(e) => setForumInput(e.target.value)}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">Post</button>
            </form>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '13px' }}>Campus Event Map</strong>
              <button onClick={() => setActiveTab('events')} style={{ border: 'none', background: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>
                Open Map →
              </button>
            </div>
            <div className="map-container" style={{ height: '110px' }}>
              <div className="map-grid">
                <div className="map-pin" style={{ top: '25%', left: '20%' }}>📍 Mech Lab</div>
                <div className="map-pin" style={{ top: '60%', left: '50%' }}>📍 Social Lawn</div>
              </div>
              <span className="map-caption">Live Geo-View</span>
            </div>
          </div>
        </aside>

        {/* Floating Create Project Button */}
        {activeTab === 'feed' && (
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="floating-create-btn"
            title="Publish New Project"
          >
            +
          </button>
        )}

        {/* Mobile Navigation Bar */}
        <nav className="bottom-nav">
          <button onClick={() => setActiveTab('feed')} className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`}>
            🏠<br/>Feed
          </button>
          <button onClick={() => setActiveTab('network')} className={`nav-btn ${activeTab === 'network' ? 'active' : ''}`}>
            🌐<br/>Network
          </button>
          <button onClick={() => setActiveTab('events')} className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}>
            📅<br/>Events
          </button>
          <button onClick={() => setActiveTab('profile')} className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}>
            👤<br/>Profile
          </button>
        </nav>

      </div>

      {/* Modal: Create New Project */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Publish Project Showcase</h3>
              <button onClick={() => setShowCreateModal(false)} className="close-icon-btn">✕</button>
            </div>
            
            <form onSubmit={handleCreateProject} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Project Title (e.g., Solar UAV v1)"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
                className="chat-input"
              />
              <input
                type="text"
                placeholder="Department / Lab (e.g., Aerospace Dept)"
                value={newProjectDept}
                onChange={(e) => setNewProjectDept(e.target.value)}
                className="chat-input"
              />
              <textarea
                placeholder="Short description of your build..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                rows={3}
                className="review-input"
              />
              <button type="submit" className="submit-review-btn">Publish to Feed</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Peer Reviews */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Peer-reviewed Research Hub</h3>
              <button onClick={() => setShowReviewModal(false)} className="close-icon-btn">✕</button>
            </div>
            
            <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 14px 0' }}>
              Submit verified technical feedback for this campus project showcase.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!reviewInput.trim()) return;
              setReviewsList([{ author: 'Alex Rivera', role: 'Verified Peer', stars: 5, text: reviewInput.trim() }, ...reviewsList]);
              setReviewInput('');
            }}>
              <textarea
                placeholder="Write your constructive peer review..."
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                rows={3}
                className="review-input"
              />
              <button type="submit" className="submit-review-btn">Post Verified Review</button>
            </form>

            <div style={{ marginTop: '16px', maxHeight: '180px', overflowY: 'auto' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>Existing Reviews</h4>
              {reviewsList.map((r, i) => (
                <div key={i} className="review-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <strong>{r.author}</strong>
                    <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.stars)}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Team Matcher */}
      {showTeamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Join Hackathon Squad</h3>
              <button onClick={() => setShowTeamModal(false)} className="close-icon-btn">✕</button>
            </div>
            
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px' }}>Team Alpha (MIT & Stanford)</strong>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 8px 0' }}>
                Building an autonomous campus rover with ROS2 nodes. Looking for 1 frontend React dev.
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="tag-skill">React Match 100%</span>
                <span className="tag-skill">Verified Student</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setTeamJoinStatus(true);
                setTimeout(() => {
                  setShowTeamModal(false);
                  setTeamJoinStatus(false);
                }, 1500);
              }}
              className="submit-review-btn"
              style={{ backgroundColor: teamJoinStatus ? '#10b981' : '#2563eb' }}
            >
              {teamJoinStatus ? 'Request Sent to Team Lead! ✓' : 'Send 1-Click Join Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}