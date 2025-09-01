import React from 'react';

const Sidebar = () => {
    return (
        <aside className="catalog-sidebar">
            <div className="filter-group">
                <h4>Ordenar por</h4>
                <ul>
                    <li>
                        <input type="checkbox" id="order-1" />
                        <label htmlFor="order-1">Lorem ipsum dolor</label>
                    </li>
                    <li>
                        <input type="checkbox" id="order-2" />
                        <label htmlFor="order-2">Lorem ipsum dolor</label>
                    </li>
                    <li>
                        <input type="checkbox" id="order-3" />
                        <label htmlFor="order-3">Lorem ipsum dolor</label>
                    </li>
                    <li>
                        <input type="checkbox" id="order-4" />
                        <label htmlFor="order-4">Lorem ipsum dolor</label>
                    </li>
                    <li>
                        <input type="checkbox" id="order-5" />
                        <label htmlFor="order-5">Lorem ipsum dolor</label>
                    </li>
                    <li>
                        <input type="checkbox" id="order-6" />
                        <label htmlFor="order-6">Lorem ipsum dolor</label>
                    </li>
                </ul>
            </div>
            <div className="filter-group">
                <h4>Descontos</h4>
                <ul>
                    <li>
                        <input type="checkbox" id="discount-1" />
                        <label htmlFor="discount-1">20%</label>
                    </li>
                    <li>
                        <input type="checkbox" id="discount-2" />
                        <label htmlFor="discount-2">5%</label>
                    </li>
                    <li>
                        <input type="checkbox" id="discount-3" />
                        <label htmlFor="discount-3">25%</label>
                    </li>
                </ul>
            </div>
            {/* Adicione outros grupos de filtro aqui */}
        </aside>
    );
};

export default Sidebar;