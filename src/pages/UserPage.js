import { GetUserDocs } from "../hooks/Client";
import { ResolveUsername } from "../hooks/Hive";


export function userPage(props) {
    const userParam = props.match.params.id;
    const userDid = ResolveUsername(userParam)

    const {posts} = GetUserDocs(userDid)

    return (<div style={{lineBreak: 'anywhere', paddingLeft:'10%', paddingRight: '10%'}}>
        {JSON.stringify(posts)}
    </div>)
}