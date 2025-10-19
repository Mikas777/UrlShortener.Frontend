import React, { useState } from "react";
import apiClient from "../../services/apiClient";
import { AppConfig } from "../../config";

interface AddUrlFormProps {
  onUrlAdded: () => void;
  onCancel: () => void;
}

export function AddUrlForm({ onUrlAdded, onCancel }: AddUrlFormProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      setError("URL cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post(AppConfig.API.URLS, {
        originalUrl: originalUrl,
      });

      onUrlAdded();
      setOriginalUrl("");
    } catch (err: unknown) {
      console.error("Failed to add URL:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add URL. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card card-body bg-light mb-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <h5 className="mb-3">Add a new Short URL</h5>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <div className="input-group">
          <input
            type="url"
            className="form-control form-control-lg"
            placeholder="https://example.com/your-very-long-url-to-shorten"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding...
              </>
            ) : (
              "Shorten"
            )}
          </button>
        </div>
      </form>
      <button
        className="btn btn-sm btn-link text-secondary mt-2"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>
    </div>
  );
}
