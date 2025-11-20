import { useState } from 'react'

import SimpleSlider from '../../components/SimpleSlider/SimpleSlider';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HamburgerMenu from '../../components/C_Header/C_Header';
import './Home.css';
import Footer from '../../components/Footer/Footer';

function Home() {
    return (
        <>
            <HamburgerMenu />
            <div className="sliderArea">
                <div className="regular slider">
                    <SimpleSlider />
                </div>
            </div>

            <div className='Home_button'>
                <a href="Login"><div className='job_button'>仕事探しの方はこちら</div></a>
                <a href="C_Login"><div className='company_button'>企業の方はこちら</div></a>
            </div>

            <div className='function'>
                <div className="function2">
                    <img src="./AI面接 - 1.png" className='img_left' />
                    <div>
                        <p className="index_title">AI面接練習</p>
                        <p className="index_p">
                            AIとチャット形式で面接練習ができる機能です。実際の面接を想定した質問に対してリアルタイムに回答し、<br />
                            表現力や受け答えの内容を磨くことができます。時間や場所を選ばず、何度でも繰り返し練習できるため、<br />自信を持って本番に臨む準備が可能です。
                        </p>
                    </div>
                </div>
                <div className="function_r2">
                    <div>
                        <p className="index_title_right">履歴書作成</p>
                        <p className="index_p_right">
                            履歴書作成機能では、志望動機の部分にAIを活用できます。基本情報や職歴などはご自身で入力し、<br />志望動機の欄はAIが希望職種や経歴に基づいて説得力のある文章を提案。<br />
                            自分の思いをうまく言語化できない方でも、魅力的な志望動機を効率よく作成できます。<br />書類の質を高めたい方におすすめのサポート機能です。
                        </p>
                    </div>
                    {/* <img src="./images/AI面接 - 2.png" alt="" className="img_right" /> */}
                    <img src="./AI面接 - 2.png" alt="" className="img_right" />
                </div>
                <div className="function2">
                    <img src="./AI面接 - 3.png" className='img_left' />
                    <div>
                        <p className="index_title">資格リスト</p>
                        <p className="index_p">
                            保有している資格をリストに登録し、気になる企業や職種が求める資格と比較することで、<br />自分に足りないスキルや資格を視覚的に把握できる機能です。目標とのギャップが一目で分かり、<br />
                            今後取得すべき資格やスキルアップの方向性を明確にできます。就職・転職活動の計画づくりに役立つ、<br />自己分析サポート機能です。
                        </p>
                    </div>
                </div>
                <div className="function_r2">
                    <div>
                        <p className="index_title_right">地域マップ</p>
                        <p className="index_p_right">
                            地域の求人を地図上から直感的に探せる機能です。現在地や希望エリアをもとに、周辺にある求人情報を<br />マップ上に表示。
                            職種や勤務条件で絞り込みもでき、通勤時間や立地も確認しながら、<br />自分に合った仕事をスムーズに見つけられます。
                            地元就職や引越し先での求人探しにも便利です。
                        </p>
                    </div>
                    <img src="./AI面接 - 4.png" alt="" className="img_right" />
                </div>
                <div className="function2">
                    <img src="./AI面接-5.png" className='img_left' />
                    <div>
                        <p className="index_title">自己診断</p>
                        <p className="index_p">
                            自分の性格や強みをチャートで可視化できる機能です。
                            いくつかの質問に答えるだけで、<br />5つのタイプからあなたの傾向を分析。
                            長所・短所、向いている仕事、人間関係の特徴などを総合的に診断します。<br />
                            自己理解を深めることで、あなたに合った働き方や職場選びのヒントが見つかります。
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home
