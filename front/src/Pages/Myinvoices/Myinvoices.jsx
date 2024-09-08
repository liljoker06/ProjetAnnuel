import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Drivebar from '../../Components/Drivebar/Drivebar';
import Profile_cardinfo from '../../Components/Profile/Profile_cardinfo';
import { getInvoicesByUserId } from '../../Functions/CallApi/CallInvoice';

import DownloadInvoicePDF from '../../Functions/MyInvoices/DownloadInvoicePDF';

export default function MyInvoices() {
    const navigate = useNavigate();

    const [user_name, setUserName] = useState(null);
    const [user_email, setUserEmail] = useState(null);
    const [company, setCompany] = useState(null);
    const [company_address, setCompanyAddress] = useState(null);
    const [company_postal, setCompanyPostal] = useState(null);
    const [company_city, setCompanyCity] = useState(null);
    const [company_siret, setCompanySiret] = useState(null);
    const [invoices, setInvoices] = useState([]);


    // user_id: invoice.User.user_id,
    // user_fname: invoice.User.user_fname,
    // user_lname: invoice.User.user_lname,
    // user_email: invoice.User.user_email,
    // comp_name: invoice.Company.comp_name,
    // comp_addre: invoice.Company.comp_addre,
    // comp_posta: invoice.Company.comp_posta,
    // comp_city: invoice.Company.comp_city,
    // comp_siret: invoice.Company.comp_siret,
    // subs_name: invoice.Subscription.subs_name,
    // subs_stora: invoice.Subscription.subs_stora,
    // subs_price: invoice.Subscription.subs_price,
    // subs_nbuser: invoice.Subscription.subs_nbuser,
    // createdAt: invoice.Subscription.createdAt

    // Vérification de la connexion
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        } else {
            getInvoicesByUserId(token)
                .then((data) => {
                    if (!data) {
                        navigate('/login');
                    } else {
                        setUserName(`${data[0].user_fname} ${data[0].user_lname}`);
                        setUserEmail(data[0].user_email);
                        setCompany(data[0].comp_name);
                        setCompanyAddress(data[0].comp_addre);
                        setCompanyPostal(data[0].comp_posta);
                        setCompanyCity(data[0].comp_city);
                        setCompanySiret(data[0].comp_siret);
                        setInvoices(data);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    navigate('/login');
                });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Drivebar />
            <main className="flex-1 p-6">
                <h2 className="text-4xl font-bold mb-4 text-gray-700">Mes Factures</h2>
                <Profile_cardinfo user_name={user_name} company={company} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invoices.map((invoice) => (
                        <div key={invoice.user_id} className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
                            <h1 className="font-bold text-2xl my-4 text-center text-blue-600">{company}</h1>
                            <hr className="mb-2" />
                            <div className="flex justify-between ">
                                <h1 className="text-lg font-bold">Facture du {new Date(invoice.createdAt).toLocaleDateString()}</h1>
                            </div>
                            <div className="text-gray-700 mb-6">
                                <div>#{invoice.user_id}</div>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-lg font-bold mb-4">Facturé à:</h2>
                                <div className="text-gray-700 mb-2">{user_name}</div>
                                <div className="text-gray-700 mb-2">{company_address}</div>
                                <div className="text-gray-700 mb-2">{company_city}, France {company_postal}</div>
                                <div className="text-gray-700">{user_email}</div>
                            </div>
                            <table className="w-full mb-8">
                                <thead>
                                    <tr>
                                        <th className="text-left font-bold text-gray-700">Description</th>
                                        <th className="text-right font-bold text-gray-700">Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-left text-gray-700">Abonnement: {invoice.subs_name}</td>
                                        <td className="text-right text-gray-700">{invoice.subs_price}€</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="text-left font-bold text-gray-700">Total</td>
                                        <td className="text-right font-bold text-gray-700">{invoice.subs_price}€</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="flex justify-center">
                                <DownloadInvoicePDF invoice={invoice} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}