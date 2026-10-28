export function FileOffer({ label }: { label: string }) {
  return (
    <p className="mb-4 text-sm font-medium" role="status">
      {label}
    </p>
  );
}
