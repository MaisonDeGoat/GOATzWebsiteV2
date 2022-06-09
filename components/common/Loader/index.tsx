import style from './loader.module.scss'

const Index = () => {
    return (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div className={style.loader}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Index