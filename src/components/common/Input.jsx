export default function Input({ label, ...props }) { return <label className="ui-field">{label}<input {...props} /></label>; }
