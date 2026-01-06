
import { getCertifications } from "@/app/actions/portfolio";
import CertificationManager from "./CertificationManager";

export const dynamic = 'force-dynamic';

export default async function AdminCertsPage() {
    const certs = await getCertifications();
    return <CertificationManager initialCerts={certs} />;
}
