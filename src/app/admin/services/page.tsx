
import { getServices } from "@/app/actions/portfolio";
import ServiceManager from "./ServiceManager";

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
    const services = await getServices();
    return <ServiceManager initialServices={services} />;
}
