// import { fetchAPI } from "../../lib/api";

export default function Pagination({ article, categories }){
console.log("eee", article)
    return(
        <> 
        <hr className="uk-divider-small" />
            <nav className="uk-navbar-pagination">
                <div className="uk-navbar-pagination-left">
                    titre : test1
                </div>
                <div className="uk-navbar-pagination-right">
                    titre : test2
                </div>
            </nav>
        </>
    )
}
