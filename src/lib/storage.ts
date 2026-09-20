import type { UserId } from "./types";

const selectedUserKey = "english-mvp:selected-user";
const scriptCatalogKey = "english-mvp:script-catalog";
const listeners = new Set<() => void>();
const catalogListeners = new Set<() => void>();

const isUserId = (value: string | null): value is UserId =>
  value === "tamoyan" || value === "gonzaemon";

export const storage = {
  loadSelectedUser(): UserId {
    if (typeof window === "undefined") return "tamoyan";
    const value = localStorage.getItem(selectedUserKey);
    return isUserId(value) ? value : "tamoyan";
  },
  saveSelectedUser(userId: UserId) {
    localStorage.setItem(selectedUserKey, userId);
    listeners.forEach((listener) => listener());
  },
  getServerSelectedUser(): UserId {
    return "tamoyan";
  },
  subscribe(listener: () => void) {
    listeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === selectedUserKey) listener();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  },
  loadScriptCatalog(): UserId {
    if (typeof window === "undefined") return "tamoyan";
    const value = localStorage.getItem(scriptCatalogKey);
    return isUserId(value) ? value : "tamoyan";
  },
  saveScriptCatalog(catalogUserId: UserId) {
    localStorage.setItem(scriptCatalogKey, catalogUserId);
    catalogListeners.forEach((listener) => listener());
  },
  getServerScriptCatalog(): UserId {
    return "tamoyan";
  },
  subscribeScriptCatalog(listener: () => void) {
    catalogListeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === scriptCatalogKey) listener();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      catalogListeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  },
};
