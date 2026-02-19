import { useEffect, useState } from "react";

import { getBlob } from "@/features/file-system/api/blob-repository";

interface Result {
	url: string | null;
	isLoading: boolean;
	error: Error | null;
}

/**
 * Fetches a blob from IndexedDB and returns a stable object URL.
 * The URL is automatically revoked when the blobKey changes or the component unmounts.
 */
export function useFileBlobUrl(blobKey: string | null): Result {
	const [url, setUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!blobKey) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setUrl(null);
			setIsLoading(false);
			setError(null);
			return;
		}

		let objectUrl: string | null = null;
		let cancelled = false;

		setUrl(null);
		setError(null);
		setIsLoading(true);

		getBlob(blobKey)
			.then((blob) => {
				if (cancelled) return;
				objectUrl = URL.createObjectURL(blob);
				setUrl(objectUrl);
			})
			.catch((err: Error) => {
				if (!cancelled) setError(err);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
			// Revoke the object URL to free memory
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [blobKey]);

	return { url, isLoading, error };
}
