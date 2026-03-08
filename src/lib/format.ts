/**
 * Reusable formatting functions for the WikiCards app.
 * Extracted from inline declarations in Card.tsx.
 */

export const formatViews = (views: number): string => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "k";
    return views.toString();
};

export const formatRelativeDate = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
};
