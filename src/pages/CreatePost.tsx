import React, { useRef, useState, useCallback } from 'react';

import MDEditor, { commands, ICommand, TextState, TextAreaTextApi } from '@uiw/react-md-editor';
import { convertToRaw, Editor, EditorState, RichUtils } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';

import {NotificationManager} from 'react-notifications';

import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import 'draft-js/dist/Draft.css';
import './DraftStyles.css'
import { ClientInstance } from '../hooks/Client';



const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        borderRadius: '0px',
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

export function CreatePost() {
    const [editorState, setEditorState] = useState<any>(EditorState.createEmpty())
    const [title, setTitle] = useState<string>('')


    const editorRef = useRef()
    const _onTab = useCallback((e) => {
        const maxDepth = 4;
        setEditorState(RichUtils.onTab(e, editorState, maxDepth));
    }, [editorState])

    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            className += ' RichEditor-hidePlaceholder';
        }
    }

    const _toggleBlockType = useCallback((blockType) => {
        setEditorState(
            RichUtils.toggleBlockType(
                editorState,
                blockType
            )
        );
    }, [editorState])

    const content = editorState.getCurrentContent();
    const rawObject = convertToRaw(content);
    const markdownString = draftToMarkdown(rawObject);

    const _toggleInlineStyle = useCallback((inlineStyle) => {
        setEditorState(
            RichUtils.toggleInlineStyle(
                editorState,
                inlineStyle
            )
        );
    }, [editorState])
    
    const _handleKeyCommand = useCallback((command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return true;
        }
        return false;
    }, [editorState])
    
    const handleCreatePost = useCallback(async () => {
        try {
            await ClientInstance.client.createDocument({
                title: title,
                body: markdownString
            })
            NotificationManager.success('Posting succesful! Go to your posts')
        } catch {
            NotificationManager.error('Posting failed!')
        }
    }, [markdownString, title])

    return (<div style={{ maxWidth: '800px', width: '95%', textAlign: 'start' }}>


        <FormControl variant="standard" style={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom style={{ textAlign: 'start' }}>
                Create a post!
            </Typography>

            <BootstrapInput fullWidth placeholder="Your title goes here!" id="bootstrap-input" style={{ marginBottom: '16px', width: '100%' }} onChange={(e: any) => setTitle(e.target.value)} />
        </FormControl>
        <div className="RichEditor-root">
            <BlockStyleControls
                editorState={editorState}
                onToggle={_toggleBlockType}
            />
            <InlineStyleControls
                editorState={editorState}
                onToggle={_toggleInlineStyle}
            />
            <div className={className}>
                <Editor
                    ref={editorRef as any}
                    blockStyleFn={getBlockStyle as any}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={_handleKeyCommand as any}
                    onChange={setEditorState}
                    onTab={_onTab}
                    placeholder="Tell a story..."
                    spellCheck={true}
                />
            </div>
        </div>
        <Button variant="contained" style={{ marginTop: '16px' }} onClick={handleCreatePost}>
            Post!
        </Button>
    </div>)
}
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};
function getBlockStyle(block: any) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}
class StyleButton extends React.Component {
    props: any
    onToggle: any
    constructor(props: any) {
        super(props);
        this.onToggle = (e: any) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}
var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];
const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];
const InlineStyleControls = (props: any) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

const BlockStyleControls = (props: any) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};