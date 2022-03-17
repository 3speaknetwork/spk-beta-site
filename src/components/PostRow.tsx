import ReactMarkdown from 'react-markdown'
import Paper from '@mui/material/Paper';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export function PostRow(props: any) {

    if (!props.title || props.title === '') {
        //return null;
    }

    return (<ListItem alignItems="flex-start">
        <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
            style={{overflowWrap: 'anywhere'}}
            primary={props.title.substring(0, 25)}
            secondary={
                <div >
                    <Divider />
                    <ReactMarkdown >
                        {props.body}
                    </ReactMarkdown>
                    <Divider />
                    {props.author}
                </div>
            }
        />
    </ListItem>)

}
