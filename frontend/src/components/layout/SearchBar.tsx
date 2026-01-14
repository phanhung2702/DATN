import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  // sync query từ URL (?q=)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(params.get("q") || "");
  }, [location.search]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm bài hát, nghệ sĩ..."
        className="w-full pl-10 pr-4 py-2 rounded-full bg-muted focus:bg-background border border-border outline-none"
      />
    </form>
  );
}
