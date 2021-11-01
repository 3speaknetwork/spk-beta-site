import ReactMarkdown from 'react-markdown'
import Paper from '@mui/material/Paper';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import { GetUserDocs } from "../hooks/Client";
import { ResolveUsername } from "../hooks/Hive";

function PostRow(props: any) {

    if (!props.title || props.title === '') {
        return null;
    }

    return (<ListItem alignItems="flex-start">
        <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
            primary={props.title.substring(0, 25)}
            secondary={
                <>
                    <Divider />
                    <ReactMarkdown >
                        {props.body}
                    </ReactMarkdown>
                </>
            }
        />
    </ListItem>)

}

export function UserPosts(props: any) {
    const userParam = props.match.params.id;
    const userDid = ResolveUsername(userParam)

    const { posts }: {
        posts: any[]
    } = GetUserDocs(userDid)

    return <div style={{ maxWidth: '600px', width: '70%', marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', color: 'black' }}>
            {posts.filter(e => !!e.content.title).map((e, index, array) =>
                <>
                    <PostRow title={e.content.title || ''} body={e.content.body || ''} />
                    {index !== array.length - 1 ? <Divider /> : null}
                </>
            )}
        </List>
    </div>
}