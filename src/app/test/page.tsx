import { CheckCircle2 } from "lucide-react";

export default function TestPage() {
  return (
    <div>
      <h1 style={{fontSize: 48, fontWeight: 700, color: '#4a148c', padding: 40, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
        <CheckCircle2 size={48} style={{color: '#22c55e'}} /> Test Page Loaded
      </h1>
      <p style={{textAlign: 'center', color: '#666'}}>
        If you see this, the basic rendering works.
      </p>
    </div>
  );
}
