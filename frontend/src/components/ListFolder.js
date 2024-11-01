import React, { useState } from 'react';

const FolderSelector = () => {
    const [files, setFiles] = useState([]);

    const handleFolderChange = async (event) => {
        const folder = event.target.files[0];

        if (folder && folder.webkitRelativePath) {
            const fileEntries = [];
            const dirReader = folder.webkitGetAsEntry().createReader();

            dirReader.readEntries(async (entries) => {
                entries.forEach(entry => {
                    if (entry.isFile) {
                        fileEntries.push(entry.name);
                    } else if (entry.isDirectory) {
                        fileEntries.push(`Folder: ${entry.name}`);
                    }
                });
                setFiles(fileEntries);
            });
        }
    };

    return (
        <div>
            <input
                type="file"
                webkitdirectory="true"
                onChange={handleFolderChange}
                style={{ marginBottom: '20px' }}
            />
            <h3>Files and Folders:</h3>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file}</li>
                ))}
            </ul>
        </div>
    );
};

export default FolderSelector;
