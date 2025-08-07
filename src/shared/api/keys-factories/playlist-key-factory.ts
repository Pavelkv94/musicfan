export const playlistKeys = {
    all: ['playlists'],
    lists: () => [...playlistKeys.all, 'lists'],
    myList: () => [...playlistKeys.lists(), 'my'],
    list: (filters: Record<string, string>) => [...playlistKeys.lists(), filters],
    details: () => [...playlistKeys.all, 'details'],
    detail: (playlistId: string) => [...playlistKeys.details(), playlistId]
};
