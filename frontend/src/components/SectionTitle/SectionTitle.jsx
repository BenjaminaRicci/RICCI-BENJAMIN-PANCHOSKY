import './SectionTitle.css';

export default function SectionTitle({ id, children }) {
    return (
        <h2 id={id} className="section-title">
            {children}
        </h2>
    );
}
