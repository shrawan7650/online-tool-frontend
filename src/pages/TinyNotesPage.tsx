import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Download,
  Upload,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import { SEOHead } from "../components/SEOHead";
import { LoginModal } from "../components/auth/LoginModal";
import { setShowLoginModal } from "../store/slices/userSlice";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export function TinyNotesPage() {
  const { isAuthenticated, user,showLoginModal } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [loading, setLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Load notes from localStorage on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load from database for Pro users
      loadNotesFromDatabase();
    } 
  }, [isAuthenticated, user]);

  // const loadNotesFromLocalStorage = () => {
  //   try {
  //     const savedNotes = localStorage.getItem("tiny-notes");
  //     if (savedNotes) {
  //       const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
  //         ...note,
  //         createdAt: new Date(note.createdAt),
  //         updatedAt: new Date(note.updatedAt),
  //       }));
  //       setNotes(parsedNotes);
  //     }
  //   } catch (error) {
  //     console.error("Error loading notes from localStorage:", error);
  //     toast.error("Failed to load notes from local storage");
  //   }
  // };

  const loadNotesFromDatabase = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("online-tool-token")}` },
      });

      const dbNotes = response.data.notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));

      setNotes(dbNotes);
      setSyncStatus("synced");
    } catch (error) {
      console.error("Error loading notes from database:", error);
      toast.error("Failed to load notes from cloud");
      setSyncStatus("error");
      // Fallback to localStorage
      // loadNotesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Save notes to localStorage whenever notes change
  // useEffect(() => {
  //   if (!isAuthenticated || !user) {
  //     // Save to localStorage for free users
  //     localStorage.setItem("tiny-notes", JSON.stringify(notes));
  //   }
  // }, [notes]);

  const saveNoteToDatabase = async (note: Note) => {
    if (!isAuthenticated || !user) return;

    setSyncStatus("syncing");
    try {
      if (note.id.startsWith("temp-")) {
        // Create new note
        const response = await axios.post(
          `${apiBaseUrl}/api/notes`,
          {
            title: note.title,
            content: note.content,
            tags: note.tags,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("online-tool-token")}`,
            },
          }
        );

        // Update note with real ID
        const updatedNote = {
          ...note,
          id: response.data.note._id,
          createdAt: new Date(response.data.note.createdAt),
          updatedAt: new Date(response.data.note.updatedAt),
        };

        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? updatedNote : n))
        );
      } else {
        // Update existing note
        await axios.put(
          `${apiBaseUrl}/api/notes/${note.id}`,
          {
            title: note.title,
            content: note.content,
            tags: note.tags,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("online-tool-token")}`,
            },
          }
        );
      }

      setSyncStatus("synced");
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving note to database:", error);
      toast.error("Failed to sync note to cloud");
      setSyncStatus("error");
    }
  };

  const deleteNoteFromDatabase = async (noteId: string) => {
    if (!isAuthenticated || !user || noteId.startsWith("temp-")) return;

    try {
      await axios.delete(`${apiBaseUrl}/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("online-tool-token")}` },
      });
    } catch (error) {
      console.error("Error deleting note from database:", error);
      toast.error("Failed to delete note from cloud");
    }
  };

  const createNote = useCallback(() => {
    if (!isAuthenticated && !user) {
      dispatch(setShowLoginModal(true));
      return;
    }

    const newNote: Note = {
      id:
        isAuthenticated && user ? `temp-${Date.now()}` : Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditTags("");
    toast.success("New note created");
  }, [isAuthenticated, user]);

  const saveNote = useCallback(() => {
    if (!selectedNote) return;

    const updatedNote: Note = {
      ...selectedNote,
      title: editTitle.trim() || "Untitled",
      content: editContent,
      tags: editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      updatedAt: new Date(),
    };

    setNotes((prev) =>
      prev.map((note) => (note.id === selectedNote.id ? updatedNote : note))
    );
    setSelectedNote(updatedNote);
    setIsEditing(false);

    // Save to database if Pro user
    if (isAuthenticated && user) {
      saveNoteToDatabase(updatedNote);
    }

    toast.success("Note saved");
  }, [
    selectedNote,
    editTitle,
    editContent,
    editTags,
    isAuthenticated,
    user,
    saveNoteToDatabase,
  ]);

  const deleteNote = useCallback(
    (noteId: string) => {
      if (confirm("Are you sure you want to delete this note?")) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
          setIsEditing(false);
        }

        // Delete from database if Pro user
        if (isAuthenticated && user) {
          deleteNoteFromDatabase(noteId);
        }

        toast.success("Note deleted");
      }
    },
    [selectedNote, isAuthenticated, user, deleteNoteFromDatabase]
  );

  const selectNote = useCallback(
    (note: Note) => {
      if (isEditing && selectedNote) {
        if (confirm("You have unsaved changes. Do you want to discard them?")) {
          setIsEditing(false);
        } else {
          return;
        }
      }
      setSelectedNote(note);
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags.join(", "));
    },
    [isEditing, selectedNote]
  );

  const startEditing = useCallback(() => {
    if (!selectedNote) return;
    setIsEditing(true);
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setEditTags(selectedNote.tags.join(", "));
  }, [selectedNote]);

  const cancelEditing = useCallback(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditTags(selectedNote.tags.join(", "));
    }
    setIsEditing(false);
  }, [selectedNote]);

  const exportNotes = useCallback(() => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tiny-notes-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Notes exported successfully");
  }, [notes]);

  const exportToCloud = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to export to cloud");
      return;
    }

    if (!user) {
      toast.error("Cloud export is available for Pro users only");
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/api/notes/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("online-tool-token")}` },
      });

      const dataStr = JSON.stringify(response.data.notes, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cloud-notes-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Cloud notes exported successfully");
    } catch (error) {
      toast.error("Failed to export cloud notes");
    }
  }, [isAuthenticated, user, apiBaseUrl]);

  const importNotes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target?.result as string);
          const validNotes = importedNotes.map((note: any) => ({
            ...note,
            id: note.id || Date.now().toString() + Math.random(),
            createdAt: new Date(note.createdAt || Date.now()),
            updatedAt: new Date(note.updatedAt || Date.now()),
            tags: note.tags || [],
          }));
          setNotes((prev) => [...validNotes, ...prev]);
          toast.success(`Imported ${validNotes.length} notes`);

          // Sync to database if Pro user
          if (isAuthenticated && user) {
            validNotes.forEach((note) => saveNoteToDatabase(note));
          }
        } catch (error) {
          toast.error("Invalid file format");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [isAuthenticated, user, saveNoteToDatabase]
  );

  const syncNotes = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast.error("Cloud sync is available for Pro users only");
      return;
    }

    await loadNotesFromDatabase();
    toast.success("Notes synced with cloud");
  }, [isAuthenticated, user, loadNotesFromDatabase]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 animate-fade-in">
      <SEOHead
        title="Tiny Notes - Quick Note Taking Tool Online"
        description="Quick note-taking tool with cloud sync, tags, search, and export features. Save notes locally or sync to cloud with Pro account."
        keywords="note taking, quick notes, cloud sync, note organizer, text notes, note app online"
        canonicalUrl="/tiny-notes"
      />
      {/* SEO Meta Tags */}
      <div style={{ display: "none" }}>
        <h1>Tiny Notes - Quick Note Taking Tool Online</h1>
        <meta
          name="description"
          content="Quick note-taking tool with cloud sync, tags, search, and export features. Save notes locally or sync to cloud with Pro account."
        />
        <meta
          name="keywords"
          content="note taking, quick notes, cloud sync, note organizer, text notes, note app online"
        />
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Tiny Notes
        </h1>
        <p className="text-lg text-slate-400">
          Quick note-taking with{" "}
          {isAuthenticated && user ? "cloud sync" : "local storage"} and export
          functionality
        </p>
        {isAuthenticated && user && (
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                syncStatus === "synced"
                  ? "bg-green-500"
                  : syncStatus === "syncing"
                  ? "bg-yellow-500 animate-pulse"
                  : syncStatus === "error"
                  ? "bg-red-500"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-xs text-slate-400">
              {syncStatus === "synced"
                ? "Synced to cloud"
                : syncStatus === "syncing"
                ? "Syncing..."
                : syncStatus === "error"
                ? "Sync error"
                : "Cloud sync enabled"}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <div className="tool-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Notes ({notes.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={createNote}
                  className="p-2 btn-secondary"
                  title="Create new note"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={exportNotes}
                  className="p-2 btn-secondary"
                  title="Export notes"
                  disabled={notes.length === 0}
                >
                  <Download className="w-4 h-4" />
                </button>
                <label
                  className="p-2 cursor-pointer btn-secondary"
                  title="Import notes"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={importNotes}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="pl-10 input-field"
              />
            </div>

            {/* Notes List */}
            <div className="space-y-2 overflow-y-auto max-h-96">
              {filteredNotes.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-slate-500">
                    {notes.length === 0
                      ? "No notes yet. Create your first note!"
                      : "No notes match your search."}
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedNote?.id === note.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-750"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {note.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                          {note.content || "No content"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">
                            {formatDate(note.updatedAt)}
                          </span>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-1 text-xs rounded bg-slate-700 text-slate-300"
                                >
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 2 && (
                                <span className="text-xs text-slate-500">
                                  +{note.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 ml-2 transition-colors text-slate-400 hover:text-red-400"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              {isAuthenticated && user && (
                <>
                  <button
                    onClick={syncNotes}
                    className="p-2 btn-secondary"
                    title="Sync with cloud"
                    disabled={loading}
                  >
                    <div className={loading ? "animate-spin" : ""}>
                      <Upload className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={exportToCloud}
                    className="p-2 btn-secondary"
                    title="Export cloud notes"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          <div className="tool-card">
            {selectedNote ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {isEditing ? "Edit Note" : "View Note"}
                  </h3>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveNote}
                          className="inline-flex items-center space-x-2 btn-primary"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="inline-flex items-center space-x-2 btn-secondary"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={startEditing}
                        className="inline-flex items-center space-x-2 btn-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-300">
                      Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-field"
                        placeholder="Note title..."
                      />
                    ) : (
                      <div className="text-lg font-medium text-white">
                        {selectedNote.title}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-300">
                      Tags (comma-separated)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        className="input-field"
                        placeholder="tag1, tag2, tag3..."
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.tags.length > 0 ? (
                          selectedNote.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-sm rounded bg-slate-700 text-slate-300"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500">No tags</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-300">
                      Content
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="h-64 textarea-field"
                        placeholder="Write your note here..."
                      />
                    ) : (
                      <div className="p-4 whitespace-pre-wrap rounded-lg bg-slate-800 min-h-64 text-slate-300">
                        {selectedNote.content || "No content"}
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  {!isEditing && (
                    <div className="pt-4 text-sm border-t text-slate-500 border-slate-700">
                      <div>Created: {formatDate(selectedNote.createdAt)}</div>
                      <div>Updated: {formatDate(selectedNote.updatedAt)}</div>
                      <div>Characters: {selectedNote.content.length}</div>
                      <div>
                        Words:{" "}
                        {
                          selectedNote.content
                            .split(/\s+/)
                            .filter((word) => word).length
                        }
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center">
                <Edit3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="mb-2 text-xl font-medium text-white">
                  No Note Selected
                </h3>
                <p className="mb-4 text-slate-400">
                  Select a note from the list or create a new one to get
                  started.
                </p>
                <button
                  onClick={createNote}
                  className="inline-flex items-center space-x-2 btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Note</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <GoogleAdSlot adSlotId="3456789012" />
      </div>

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Features{" "}
          {!isAuthenticated && (
            <span className="text-sm text-slate-400">
              (Sign in for Pro features)
            </span>
          )}
        </h3>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-white">Free Features:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Create, edit, and delete notes</li>
              <li>✓ Search through titles, content, and tags</li>
              <li>✓ Tag organization system</li>
              <li>✓ Cloud sync across devices</li>
              <li>✓ Export/import JSON files</li>
            </ul>
          </div>
          {/* <div>
            <h4 className="mb-2 font-medium text-white">
              Pro Features{" "}
              {user && <span className="text-green-400">(Active)</span>}:
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li className={user ? "text-green-400" : "text-slate-500"}>
                {user ? "✓" : "○"} Cloud sync across devices
              </li>
              <li className={user ? "text-green-400" : "text-slate-500"}>
                {user ? "✓" : "○"} Automatic cloud backup
              </li>
              <li className={user ? "text-green-400" : "text-slate-500"}>
                {user ? "✓" : "○"} Advanced export options
              </li>
              <li className={user ? "text-green-400" : "text-slate-500"}>
                {user ? "✓" : "○"} Unlimited notes
              </li>
            </ul>
          </div> */}
        </div>
        {!isAuthenticated && (
          <div className="p-4 mt-4 border rounded-lg bg-blue-900/20 border-blue-700/30">
            <p className="text-sm text-blue-200">
              <strong>Upgrade to Pro</strong> for cloud sync, unlimited notes,
              and advanced features  Comming Soon....
              <button className="ml-1 text-blue-400 underline hover:text-blue-300">
                Learn more 
              </button>
            </p>
          </div>
        )}
      </div>
      {!isAuthenticated && !user && !showLoginModal && <LoginModal />}
    </div>
  );
}
