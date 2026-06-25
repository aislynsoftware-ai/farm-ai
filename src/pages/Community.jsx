import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Plus, Image, Mic, Video, Send, Trash2, Loader, X, Play, Pause, Camera, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';
import Sidebar from '../components/dashboard/Sidebar';
import api from '../services/api';

function useRecorder(type) {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const start = useCallback(async () => {
    chunks.current = [];
    setBlob(null);
    if (url) { URL.revokeObjectURL(url); setUrl(null); }
    try {
      const constraints = type === 'video'
        ? { audio: true, video: { facingMode: 'user', width: { ideal: 480 } } }
        : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mimeType = type === 'video'
        ? MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : ''
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorder.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const b = new Blob(chunks.current, { type: mimeType || 'audio/webm' });
        setBlob(b);
        setUrl(URL.createObjectURL(b));
      };
      mr.start();
      setRecording(true);
    } catch (e) { console.error(e); alert('Microphone/camera access denied'); }
  }, [type, url]);

  const stop = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setBlob(null);
    if (url) { URL.revokeObjectURL(url); setUrl(null); }
  }, [stop, url]);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  return { recording, blob, url, start, stop, reset };
}

function RecorderButton({ type, blob, url, recording, start: onStart, stop: onStop, reset: onReset }) {
  return (
    <div className="flex items-center gap-2">
      {!recording && !blob && (
        <button type="button" onClick={onStart} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs hover:bg-emerald-200 dark:hover:bg-emerald-900/80 cursor-pointer">
          {type === 'video' ? <Camera size={14} /> : <Mic size={14} />}
          {type === 'video' ? 'Record Video' : 'Record Voice'}
        </button>
      )}
      {recording && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-500">Recording...</span>
          <button type="button" onClick={onStop} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 cursor-pointer"><Pause size={14} /></button>
        </div>
      )}
      {blob && url && (
        <div className="flex items-center gap-2">
          {type === 'video' ? (
            <video src={url} controls className="h-16 rounded-lg bg-black" />
          ) : (
            <audio src={url} controls className="h-8" />
          )}
          <button type="button" onClick={onReset} className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"><X size={14} /></button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, currentUser, onDelete, onReplyAdded }) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyVoice, setReplyVoice] = useState(null);
  const [replyVideo, setReplyVideo] = useState(null);
  const [voiceRecorder, setVoiceRecorder] = useState(null);
  const [videoRecorder, setVideoRecorder] = useState(null);
  const [sending, setSending] = useState(false);

  const loadReplies = async () => {
    try { setReplies(await api.community.replies(post.id)); } catch {}
  };
  useEffect(() => { if (showReplies) loadReplies(); }, [showReplies, post.id]);

  const handleReply = async () => {
    if (!replyText.trim() && !replyVoice && !replyVideo) return;
    setSending(true);
    try {
      await api.community.addReply(post.id, currentUser.user_id, { content: replyText, voice: replyVoice, video: replyVideo });
      setReplyText(''); setReplyVoice(null); setReplyVideo(null);
      if (voiceRecorder) voiceRecorder.reset();
      if (videoRecorder) videoRecorder.reset();
      await loadReplies();
      setShowReplies(true);
      if (onReplyAdded) onReplyAdded();
    } catch (e) { alert(e.message); }
    setSending(false);
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('Delete this reply?')) return;
    try { await api.community.deleteReply(replyId, currentUser.user_id); loadReplies(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 p-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 overflow-hidden flex-shrink-0">
            {post.user_profile_pic ? <img src={post.user_profile_pic} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">{(post.user_name || '?')[0]}</div>}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.user_name || 'Unknown'}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{post.created_at}</p>
          </div>
        </div>
        {currentUser && post.user_id === currentUser.user_id && (
          <button onClick={() => onDelete(post.id)} className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"><Trash2 size={14} /></button>
          )}
        </div>

      {/* Post Content */}
      {post.title && <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{post.title}</h3>}
      {post.content && <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">{post.content}</p>}

      {/* Post Media */}
      {post.image_url && <img src={post.image_url} alt="" className="w-full max-h-72 object-contain rounded-lg mb-3 bg-gray-50 dark:bg-gray-900" />}
      {post.video_url && <video src={post.video_url} controls className="w-full max-h-72 rounded-lg mb-3 bg-black" />}
      {post.voice_url && <audio src={post.voice_url} controls className="w-full mb-3" />}

      {/* Actions */}
      <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer">
        <MessageSquare size={13} />
        <span>{post.reply_count || 0} replies</span>
        {showReplies ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* Replies */}
      {showReplies && (
        <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-700 space-y-3">
          {replies.map(r => (
            <div key={r.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 overflow-hidden flex-shrink-0">
                {r.user_profile_pic ? <img src={r.user_profile_pic} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">{(r.user_name || '?')[0]}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{r.user_name || 'Unknown'}</span>
                  <span className="text-[10px] text-gray-500">{r.created_at}</span>
                  {currentUser && r.user_id === currentUser.user_id && (
                    <button onClick={() => handleDeleteReply(r.id)} className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer"><X size={12} /></button>
                  )}
                </div>
                {r.content && <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{r.content}</p>}
                {r.video_url && <video src={r.video_url} controls className="w-full max-h-40 rounded-lg mt-1 bg-black" />}
                {r.voice_url && <audio src={r.voice_url} controls className="w-full mt-1" />}
              </div>
            </div>
          ))}

          {/* Reply Input */}
          <div className="flex gap-2 items-start">
            {currentUser ? (
              <>
                <div className="flex-1 space-y-2">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-xs" />
                  <div className="flex gap-2">
                    <ReplyRecorder type="voice" onBlob={(b) => setReplyVoice(b)} recorderRef={setVoiceRecorder} />
                    <ReplyRecorder type="video" onBlob={(b) => setReplyVideo(b)} recorderRef={setVideoRecorder} />
                  </div>
                </div>
                <button onClick={handleReply} disabled={sending} className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                  {sending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-500">Login to reply</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReplyRecorder({ type, onBlob, recorderRef }) {
  const recorder = useRecorder(type);
  useEffect(() => { recorderRef(recorder); }, [recorderRef, recorder]);
  useEffect(() => { onBlob(recorder.blob); }, [recorder.blob, onBlob]);
  return <RecorderButton type={type} {...recorder} />;
}

export default function Community() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', image: null, video: null, voice: null });
  const [postVoiceRecorder, setPostVoiceRecorder] = useState(null);
  const [postVideoRecorder, setPostVideoRecorder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try { setPosts(await api.community.posts()); } catch {}
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login required');
    setCreating(true);
    try {
      const data = { title: form.title, content: form.content, image: form.image, video: postVideoRecorder?.blob, voice: postVoiceRecorder?.blob };
      await api.community.addPost(user.user_id, data);
      setShowCreate(false);
      setForm({ title: '', content: '', image: null, video: null, voice: null });
      if (postVoiceRecorder) postVoiceRecorder.reset();
      if (postVideoRecorder) postVideoRecorder.reset();
      await loadPosts();
    } catch (e) { alert(e.message); }
    setCreating(false);
  };

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try { await api.community.deletePost(postId, user.user_id); loadPosts(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-emerald-950">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-x-hidden">
        <SEO title="Community" description="Post leaf images and discuss with farmers" url="/community" />
        <div className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-emerald-950/80 backdrop-blur border-b border-emerald-100 dark:border-emerald-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Community</span>
        </div>
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Posts</h2>
            {user && (
              <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
                <Plus size={16} /> New Post
              </button>
            )}
          </div>

          {!user && (
            <div className="text-center py-12 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Login to create posts and reply</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(p => <PostCard key={p.id} post={p} currentUser={user} onDelete={handleDelete} />)}
            </div>
          )}

          {/* Create Post Modal */}
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCreate(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">New Post</h3>
                  <button onClick={() => setShowCreate(false)} className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200 cursor-pointer"><X size={18} /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title (optional)" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm" />
                  </div>
                  <div>
                    <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Describe your crop issue..." rows={3} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 hover:border-emerald-400 cursor-pointer">
                      <Image size={16} className="text-emerald-500" />
                      {form.image ? form.image.name : 'Upload leaf image'}
                      <input type="file" accept="image/*" onChange={e => setForm(p => ({ ...p, image: e.target.files[0] || null }))} className="hidden" />
                    </label>
                    {form.image && <img src={URL.createObjectURL(form.image)} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
                  </div>
                  <div className="flex gap-3">
                    <CreateRecorder type="voice" recorderRef={setPostVoiceRecorder} />
                    <CreateRecorder type="video" recorderRef={setPostVideoRecorder} />
                  </div>
                  <button type="submit" disabled={creating} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                    {creating ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                    {creating ? 'Posting...' : 'Post'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CreateRecorder({ type, recorderRef }) {
  const recorder = useRecorder(type);
  useEffect(() => { recorderRef(recorder); }, [recorderRef, recorder]);
  return <RecorderButton type={type} {...recorder} />;
}
