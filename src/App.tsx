import client from './shared/api/client';
import { useQuery } from '@tanstack/react-query';

function App() {
    // useEffect(() => {
    //     (async () => {
    //         const res = await client.GET('/playlists');
    //         console.log(res.data);
    //     })();
    // }, []);

    const query = useQuery({
        queryKey: ['playlists'],
        queryFn: () => client.GET('/playlists'),
    });

    return <></>;
}

export default App;
