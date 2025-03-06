import CartIcon, { AccountIcon } from "../Common/Icons/Icons"
import "./header.css"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { userContext } from "../../context/userContext/userContext"

export default function Header() {
    const { isAuth, userData, isLoading } = useContext(userContext)
    const navigate = useNavigate()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className="header-container">
            <h2>E-TIANGUIS</h2>

            <div className="input-list-container">
                <input className="input-search" type="text" />
                <div className="list-container">
                    <ul>
                        <button>Categorias</button>
                        <li>Tendencias</li>
                        <li>Ofertas</li>
                        <li>Ayuda</li>
                    </ul>
                </div>
            </div>

            <div className="cart-icon">
                <CartIcon
                    color="black"
                    height="45px"
                    width="50px"
                    className="cart-iconn"
                    onClick={() => {
                        if (!isAuth && !userData && !isLoading) {
                            navigate('/selectAccount')
                        } else {
                            navigate('/cart')
                        }
                    }}
                />
            </div>

            <div className="account-icon-container">
                <AccountIcon
                    color="black"
                    height="55px"
                    width="50px"
                    className="account-icon"
                    onClick={() => {
                        if (!isAuth && !userData && !isLoading) {
                            navigate('/selectAccount')
                        } else {
                            navigate('/profile')
                        }
                    }}
                />
                <p>{!isAuth && !userData && !isLoading ? 'Ingresar' : ''}</p>
            </div>

            {/* Botón para el menú hamburguesa en pantallas pequeñas */}
            <div className="hamburger-menu" onClick={toggleMenu}>
                <button>☰</button>
            </div>

            {/* Menú móvil */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <ul>
                        <li onClick={() => navigate('/cart')}>Carrito</li>
                        <li onClick={() => navigate('/profile')}>Perfil</li>
                        <li>Tendencias</li>
                        <li>Ofertas</li>
                        <li>Ayuda</li>
                        <button onClick={() => navigate('/categories')}>Categorías</button>
                    </ul>
                </div>
            )}
        </div>
    )
}
