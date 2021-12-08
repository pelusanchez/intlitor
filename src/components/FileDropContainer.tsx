export const FileDropContainer = ({ children }: React.PropsWithChildren<any>) => {

    const onDragEnter = () => {

    }

    const onDragOver = () => {

    }

    const onFileDrop = () => {
        
    }
    return (<div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDrop={onFileDrop}>
        { children }
        </div>)
}
