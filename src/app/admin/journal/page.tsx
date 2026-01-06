
import { getJournalEntries } from "@/app/actions/portfolio";
import JournalManager from "./JournalManager";

export const dynamic = 'force-dynamic';

export default async function AdminJournalPage() {
    const logs = await getJournalEntries();
    return <JournalManager initialLogs={logs} />;
}
