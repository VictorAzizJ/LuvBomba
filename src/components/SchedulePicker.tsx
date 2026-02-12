import { RetroInput } from "./RetroInput";

export function SchedulePicker({
  value,
  timezone,
  onChange,
  onTimezoneChange,
}: {
  value: string;
  timezone: string;
  onChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="text-lg">
        <span className="mb-1 block">Schedule Time</span>
        <RetroInput
          type="datetime-local"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <label className="text-lg">
        <span className="mb-1 block">Timezone</span>
        <RetroInput
          type="text"
          required
          placeholder="America/New_York"
          value={timezone}
          onChange={(event) => onTimezoneChange(event.target.value)}
        />
      </label>
    </div>
  );
}
