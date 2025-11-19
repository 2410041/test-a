import favorites from "./favorite"
import styles from "./Favorite.module.css"
import assets from "../../../images/test.jpg"

export default function Favorite() {
    return (
        <div className={styles.favoriteRoot}>
            <h2>お気に入り リスト</h2>
            <div className={styles.favoriteItems} id ="favoriteItemsContainer"></div>

                {favorites.map((favorite, index) => (
                    <div className={styles.favoriteItem} key={index}>
                    <img src={assets} alt="" />
                    <div className={styles.favoriteItemDetails}>
                        <h3>{favorite.company}</h3>
                        <div>
                            <dl>
                                <dt>職種名</dt>
                                <dd>{favorite.position}</dd>
                                <dt>給与</dt>
                                <dd>{favorite.salary}</dd>
                                <dt>勤務地</dt>
                                <dd>{favorite.location}</dd>
                                <dt>開発環境</dt>
                                <dd>{favorite.tech}</dd>
                            </dl>
                        </div>
                    </div>
                    <button type="submit" className={styles.removeFavorite}>削除</button>
                </div>
            ))}

        </div>
    )
}