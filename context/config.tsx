import { createContext, useContext, useState } from 'react';
interface ConfigContextData {
    searchConfig: {
        bgColor: string;
        borderColor: string;
        categories: boolean;
        displayPrice: boolean;
        filter: boolean;
        placeholder: string;
        prodDescription: string;
        position: {
            value: string;
            content: string;
        };
        view: {
            value: string;
            content: string;
        };
        hitsPerPage: number;
        searchAttributes: {
            sku: {
                isActive: boolean,
                sort: string
            },
            parentSku: {
                isActive: boolean,
                sort: string
            },
            'options.value': {
                isActive: boolean,
                sort: string
            },
            description: {
                isActive: boolean,
                sort: string
            },
            categories: {
                isActive: boolean,
                sort: string
            },
            name: {
                isActive: boolean,
                sort: string
            }
        }[];
    };
    searchId: any;
    updateConfig: (value: any) => void;
    updateID: (id: any) => void;
}
const ConfigContext = createContext({} as ConfigContextData);
const ConfigProvider = ({ children }) => {
    const [searchConfig, setSearchConfig] = useState({
        bgColor: '',
        borderColor: '',
        categories: false,
        displayPrice: false,
        filter: false,
        placeholder: '',
        prodDescription: '',
        position: {
            value: '',
            content: '',
        },
        view: {
            value: '',
            content: '',
        },
        hitsPerPage: 0,
        searchAttributes: [
            {
            sku: {
                isActive: false,
                sort: '',
            },
            parentSku: {
                isActive: false,
                sort: '',
            },
            'options.value': {
                isActive: false,
                sort: '',
            },
            description: {
                isActive: false,
                sort: '',
            },
            categories: {
                isActive: false,
                sort: '',
            },
            name: {
                isActive: false,
                sort: '',
            },
            },
        ],
    });
    const [searchId, setSearchId] = useState('')
    const updateConfig = (value:any) => {
        setSearchConfig(value);
    }
    const updateID = (id: any) => {
        setSearchId(id)
    }
    return (
        <ConfigContext.Provider value={{ searchConfig, searchId,  updateConfig, updateID}}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = () => useContext(ConfigContext);

export default ConfigProvider;