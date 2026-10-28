import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell";
import { Button, Field, PageTitle, Panel, SelectInput, TextInput } from "@/components/ui";
import { createSearch } from "@/lib/prospecting/server";
import { RUBRIC } from "@/lib/prospecting/score";
import { loadCities } from "@/lib/us-cities";

export const Route = createFileRoute("/search/new")({ component: NewSearchPage });

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const ROLES = ["Owner", "Founder", "General manager", "Managing partner", "Business inbox"];

function NewSearchPage() {
  return (
    <AppShell>
      <NewSearch />
    </AppShell>
  );
}

function NewSearch() {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState("Independent restaurants");
  const [region, setRegion] = useState("Texas");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [target, setTarget] = useState(25);
  const [roles, setRoles] = useState<string[]>(["Owner", "Founder", "General manager"]);
  const [professional, setProfessional] = useState(true);
  const [business, setBusiness] = useState(true);
  const [website, setWebsite] = useState(true);
  const [multi, setMulti] = useState(true);
  const [exclusions, setExclusions] = useState("");
  const [spend, setSpend] = useState(25);
  const [simulate, setSimulate] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let stop = false;
    void loadCities(region).then((list) => {
      if (stop) return;
      setCities(list);
      setCity((current) => (list.includes(current) ? current : ""));
    });
    return () => {
      stop = true;
    };
  }, [region]);

  function toggleRole(role: string) {
    setRoles((current) => (current.includes(role) ? current.filter((r) => r !== role) : [...current, role]));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const emailTypes = [professional ? "professional" : "", business ? "business" : ""].filter(Boolean) as Array<
      "professional" | "business"
    >;
    setPending(true);
    const result = await createSearch({
      data: {
        industry,
        country: "United States",
        region,
        city,
        targetCount: target,
        contactRoles: roles,
        emailTypes,
        preferMultiple: multi,
        requireWebsite: website,
        exclusions,
        maxSpendCents: Math.round(spend * 100),
        simulateFailure: simulate,
      },
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await navigate({ to: "/search/$searchId", params: { searchId: result.id } });
  }

  return (
    <div>
      <PageTitle
        eyebrow="New search"
        title="Define the market"
        lede="Target count is a goal. The run keeps restaurants OpenStreetMap returns for that city, then reads each company website for a published email."
      />
      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Industry" hint="Live search covers restaurants, cafes, and bars. Other industries return no records.">
              <TextInput value={industry} onChange={(e) => setIndustry(e.target.value)} required />
            </Field>
            <Field label="Country">
              <TextInput value="United States" readOnly />
            </Field>
            <Field label="State">
              <SelectInput
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setCity("");
                }}
              >
                {STATES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="City" hint={cities.length ? `${cities.length} cities in ${region}` : `Loading cities in ${region}`}>
              <SelectInput value={city} onChange={(e) => setCity(e.target.value)} required disabled={!cities.length}>
                <option value="">Select a city</option>
                {cities.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Target count">
              <TextInput
                type="number"
                min={1}
                max={200}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </Field>
            <Field label="Maximum spend" hint="Map lookups are free. This cap still stops paid draft and summary calls.">
              <TextInput
                type="number"
                min={0}
                max={1000}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
              />
            </Field>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Preferred contacts</legend>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <label key={role} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm">
                  <input type="checkbox" checked={roles.includes(role)} onChange={() => toggleRole(role)} />
                  {role}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2 sm:grid-cols-2">
            <legend className="sr-only">Rules</legend>
            <Check label="Person-specific emails" checked={professional} onChange={setProfessional} />
            <Check label="Business inboxes" checked={business} onChange={setBusiness} />
            <Check label="Require a website" checked={website} onChange={setWebsite} />
            <Check label="Prefer multiple locations" checked={multi} onChange={setMulti} />
          </fieldset>
          <Field label="Exclusions" hint="Comma-separated words. Matching names are left out, not rewritten.">
            <TextInput value={exclusions} onChange={(e) => setExclusions(e.target.value)} placeholder="cantina" />
          </Field>
          <Check
            label="Demonstrate a recoverable provider timeout"
            checked={simulate}
            onChange={setSimulate}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={pending || !city}>
            {pending ? "Queuing…" : "Start search"}
          </Button>
        </Panel>
        <Panel>
          <h2 className="font-display text-2xl">Scoring rubric</h2>
          <p className="mt-2 text-sm text-muted">Weights are a starting assumption, recomputed in application code.</p>
          <ul className="mt-4 space-y-2">
            {RUBRIC.map((row) => (
              <li key={row.key} className="flex items-baseline justify-between gap-3 text-sm">
                <span>{row.label}</span>
                <span className="tabular-nums text-muted">{row.weight}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">80–100 high priority · 60–79 potential · below 60 lower priority.</p>
        </Panel>
      </form>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
