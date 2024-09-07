import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    logo: { width: 60, height: 60 },
    companyTitle: { fontSize: 24, fontWeight: 'bold', color: '#007BFF' },
    section: { margin: 10, padding: 20, flexGrow: 1, backgroundColor: '#fff', borderRadius: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#007BFF', marginBottom: 10 },
    text: { fontSize: 12, marginBottom: 5, color: '#333' },
    bubble: { backgroundColor: '#007BFF', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 10 },
    bubbleText: { fontSize: 12, color: '#fff' },
    table: { display: 'table', width: 'auto', marginTop: 20, marginBottom: 20 },
    tableRow: { flexDirection: 'row' },
    tableColHeader: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#007BFF', padding: 8, backgroundColor: '#007BFF' },
    tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#007BFF', padding: 8 },
    tableCellHeader: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    tableCell: { fontSize: 10, color: '#007BFF' },
    footer: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10, textAlign: 'center', fontSize: 10, color: '#777' },
    separator: { borderBottomWidth: 1, borderBottomColor: '#fff', marginVertical: 10 }
});

export const InvoicePDF = ({ invoice }) => {
    const tvaRate = 20; // TVA à 20%
    const ttc = invoice.subs_price;
    const ht = (ttc / (1 + tvaRate / 100)).toFixed(2); // Calcul du montant HT
    const tva = (ttc - ht).toFixed(2); // Montant de la TVA

    return (
        <Document> 
            <Page style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.logo} src="/img/logo.png" />
                        <Text style={styles.companyTitle}>Vitruve Cloud</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>Date: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
                        <Text style={styles.text}>Facture #: {invoice.invo_id}</Text>
                    </View>
                </View>

                {/* Client Info */}
                <View style={styles.bubble}>
                    <Text style={styles.bubbleText}>Facturé à</Text>
                    <View style={styles.separator} />
                    <Text style={styles.bubbleText}>Nom : {invoice.user_fname} {invoice.user_lname}</Text>
                    <Text style={styles.bubbleText}>Entreprise: {invoice.comp_name}</Text>
                    <Text style={styles.bubbleText}>Adresse: {invoice.comp_addre}, {invoice.comp_city}, {invoice.comp_posta}</Text>
                    <Text style={styles.bubbleText}>Email: {invoice.user_email}</Text>
                    <Text style={styles.bubbleText}>SIRET: {invoice.comp_siret}</Text>
                </View>

                {/* Détails de la facture */}
                <View style={styles.section}>
                    <Text style={styles.title}>Détails de la Facture</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>Description</Text>
                            </View>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCellHeader}>Montant</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Abonnement: {invoice.subs_name}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{ttc}€ TTC</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Stockage: {invoice.subs_stora} Go</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Utilisateurs: {invoice.subs_nbuser}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.text}>Montant HT: {ht}€</Text>
                    <Text style={styles.text}>TVA (20%): {tva}€</Text>
                    <Text style={styles.text}>Total TTC: {ttc}€</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Merci pour votre achat. Pour toute question, contactez-nous à support@vitruvecloud.com</Text>
                    <Text>Vitruve Cloud - SIRET: 15934625879465 - AlaMaison, Paris-France, 75000</Text>
                </View>
            </Page>
        </Document>
    );
};

const DownloadInvoicePDF = ({ invoice }) => (
    <PDFDownloadLink
        document={<InvoicePDF invoice={invoice} />}
        fileName={`FactureVitruveCloud_${invoice.comp_name}_${invoice.invo_id}_(${new Date(invoice.createdAt).toLocaleDateString()}).pdf`}
    >
        {({ loading }) => (
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {loading ? 'Génération du PDF...' : 'Télécharger'}
            </button>
        )}
    </PDFDownloadLink>
);

export default DownloadInvoicePDF;
