import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import type { UrlItem, AuthUser } from "../../types/api";
import { AppConfig } from "../../config";
import { FullPageSpinner } from "../../components/ui/Spinner";
import { AddUrlForm } from "./AddUrlForm";

export function UrlTable() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const urlsPromise = apiClient.get<UrlItem[]>(AppConfig.API.URLS);
      const authPromise = apiClient.get<AuthUser>(AppConfig.API.AUTH_ME);

      const [urlsResult, authResult] = await Promise.allSettled([
        urlsPromise,
        authPromise,
      ]);

      if (urlsResult.status === "fulfilled") {
        setUrls(urlsResult.value.data);
      } else {
        console.error("Failed to fetch URLs:", urlsResult.reason);
        setError("Failed to load URL list. The server might be down.");
      }

      if (authResult.status === "fulfilled") {
        setCurrentUser(authResult.value.data);
      } else {
        setCurrentUser(null);
        console.log("User is not authenticated (from /me)");
      }
    } catch (err: unknown) {
      console.error("Failed to fetch data:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUrlAdded = () => {
    fetchData();
    setIsFormVisible(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }
    try {
      await apiClient.delete(AppConfig.API.DELETE_URL(id));
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
    } catch (err) {
      console.error("Failed to delete URL:", err);
      alert("Failed to delete URL. You may not have permission.");
    }
  };

  const handleAddClick = () => {
    console.log("handleAddClick called. currentUser:", currentUser);
    if (currentUser) {
      console.log("User exists, showing form.");
      setIsFormVisible(true);
    } else {
      console.log("User is null, redirecting to login.");
      const returnUrl = window.location.href;
      window.location.href = `${
        AppConfig.LOGIN_PAGE_URL
      }?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All URLs</h2>
        {!isFormVisible && (
          <button className="btn btn-primary btn-lg" onClick={handleAddClick}>
            Add New URL
          </button>
        )}
      </div>

      {isFormVisible && (
        <AddUrlForm
          onUrlAdded={handleUrlAdded}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No URLs have been created yet.
              </td>
            </tr>
          ) : (
            urls.map((url) => {
              const canDelete =
                currentUser &&
                (currentUser.isAdmin || currentUser.id === url.createdById);

              return (
                <tr key={url.id}>
                  <td>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={url.originalUrl}
                    >
                      {url.originalUrl.length > 60
                        ? url.originalUrl.substring(0, 60) + "..."
                        : url.originalUrl}
                    </a>
                  </td>
                  <td>
                    <a
                      href={AppConfig.SHORT_URL_REDIRECT(url.shortCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`short.ly/${url.shortCode}`}
                    </a>
                  </td>
                  <td>
                    {currentUser && (
                      <a
                        href={AppConfig.INFO_PAGE_URL(url.id)}
                        className="btn btn-sm btn-info me-2"
                      >
                        Info
                      </a>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(url.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
