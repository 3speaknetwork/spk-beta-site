import { Container, Divider } from '@mui/material'
import { PostRow } from '../components/PostRow'
import { GetFeedPosts } from '../hooks/Client'
import List from '@mui/material/List';

export function FeedsPage() {
    const { posts } = GetFeedPosts()
    console.log(posts)
    return (<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', color: 'black' }}>
            {(posts || []).filter((e: any) => !!e.content.title).map((e: any, index: number, array: any[]) =>
                <>
                    <PostRow title={e.content.title || ''} body={e.content.body || ''} author={e.creator_id}/>
                    {index !== array.length - 1 ? <Divider /> : null}
                </>
            )}
        </List>)
    
}