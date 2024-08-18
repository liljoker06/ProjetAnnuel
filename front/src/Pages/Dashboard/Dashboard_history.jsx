import React from 'react';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function Dashboard_history() {

    const history = [
        {
            action: "Modifié",
            file: "xxx.doc",
            date: "06/10/2023"
        },
        {
            action: "Supprimé",
            file: "yyy.doc",
            date: "05/10/2023"
        },
        {
            action: "Créé",
            file: "zzz.doc",
            date: "04/10/2023"
        },
        {
            action: "Modifié",
            file: "aaa.doc",
            date: "03/10/2023"
        },
        {
            action: "Supprimé",
            file: "bbb.doc",
            date: "02/10/2023"
        },
        {
            action: "Créé",
            file: "ccc.doc",
            date: "01/10/2023"
        },
    ];

    const getIcon = (action) => {
        switch (action) {
            case "Modifié":
                return <EditIcon className="text-blue-500 mr-2" />;
            case "Supprimé":
                return <DeleteIcon className="text-red-500 mr-2" />;
            case "Créé":
                return <AddIcon className="text-green-500 mr-2" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 shadow rounded-lg mb-5">
            <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center">
                <HistoryIcon className="mr-2" /> Historique
            </h2>
            <ul className="space-y-4">
                {history.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                        {getIcon(item.action)}
                        <span className="font-semibold">{item.file}</span> - {item.action}
                        <span className="text-sm text-gray-500 ml-2">({item.date})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}