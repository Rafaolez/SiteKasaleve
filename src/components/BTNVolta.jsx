import { Link } from "react-router-dom";

function BTNVolta() {
    return (
        <div style={styles.DivBTNVolta}>
            <Link style={styles.BTNVolta} to={"/"}>⬅</Link>
        </div>

    );
}
export default BTNVolta;

const styles = {
    BTNVolta: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '2.5rem',
        color: '#000000ff',
        textDecoration: 'none',
        fontSize: '2.4rem',
        borderRadius: '10px',
    },
    DivBTNVolta: {
        display: 'flex',
        marginTop: '1rem',
        width: '15%',
        display: 'flex',
    }
}