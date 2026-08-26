import { PracticeMode, PreviewItem, Scene, Scenario, StoryTurn, UserProfile, VocabularyItem } from "./types";

export const USERS: UserProfile[] = [
  { id: "tamoyan", name: "タモやん", conversationName: "Motoki", emoji: "🧳", scenarioId: "hotel", difficulty: { speed: 3, reductions: 2, listening: 3 } },
  { id: "gonzaemon", name: "ちゃみ", conversationName: "Mari", emoji: "🛬", scenarioId: "airport", difficulty: { speed: 3, reductions: 2, listening: 3 } },
];

const basic = [{ english: "I see.", japanese: "なるほど" }, { english: "That sounds good.", japanese: "それで良さそうです" }, { english: "Sorry?", japanese: "もう一度お願いします" }];
const thanks = [{ english: "Great, thank you.", japanese: "よかった、ありがとう" }, { english: "Got it.", japanese: "分かりました" }, { english: "I appreciate it.", japanese: "助かります" }];

const hotelScenes: Scene[] = [
  { id:"checkin", title:"フロントでチェックイン", icon:"🔑", start:"ホテルのフロントでスタッフが Welcome to our hotel. と声をかけるところ", goal:"予約名を伝え、鍵と基本情報を受け取る", stages:["チェックインを頼む","予約名を伝える","鍵と朝食時間を確認する"], story:[
    {role:"staff",english:"Good afternoon. Welcome to our hotel. How can I help you?",japanese:"こんにちは。ようこそ。ご用件を伺います。"},{role:"learner",english:"I'd like to check in. I have a reservation under Motoki.",japanese:"チェックインをお願いします。Motokiの名前で予約しています。"},{role:"staff",english:"Certainly. May I see your passport, please?",japanese:"パスポートを拝見できますか。"},{role:"learner",english:"Sure. Here you are.",japanese:"はい、どうぞ。"},{role:"staff",english:"Breakfast is from seven to ten on the second floor.",japanese:"朝食は2階で7時から10時です。"},{role:"learner",english:"Got it. Is Wi-Fi included?",japanese:"分かりました。Wi-Fiは含まれていますか。"},{role:"staff",english:"Yes. The password is on your room key holder.",japanese:"パスワードはカードケースにあります。"},{role:"learner",english:"Great, thank you.",japanese:"よかった、ありがとうございます。"}], preview:[{english:"I'd like to check in.",japanese:"チェックインをお願いします"},{english:"I have a reservation under Motoki.",japanese:"Motokiの名前で予約しています"},{english:"Is Wi-Fi included?",japanese:"Wi-Fiは含まれていますか"},{english:"What time is breakfast?",japanese:"朝食は何時ですか"}], reactions:thanks, vocabulary:[{term:"reservation",japanese:"予約",example:"I have a reservation."},{term:"room key",japanese:"部屋の鍵",example:"Here is your room key."},{term:"included",japanese:"含まれている",example:"Wi-Fi is included."}] },
  { id:"breakfast", title:"朝食会場", icon:"☕", start:"朝食会場の入口でスタッフが Good morning. と迎えるところ", goal:"人数を伝え、席や料理、飲み物について確認する", stages:["人数を伝える","席を案内してもらう","料理や飲み物を尋ねる"], story:[
    {role:"staff",english:"Good morning. How many people?",japanese:"おはようございます。何名様ですか。"},{role:"learner",english:"Just one, please.",japanese:"1人です。"},{role:"staff",english:"Would you prefer a table by the window?",japanese:"窓側の席がよろしいですか。"},{role:"learner",english:"That sounds good, thank you.",japanese:"それがいいです。ありがとう。"},{role:"staff",english:"The buffet is over there. Coffee and tea are self-service.",japanese:"ビュッフェはあちらです。飲み物はセルフサービスです。"},{role:"learner",english:"I see. Do you have any vegetarian dishes?",japanese:"なるほど。ベジタリアン料理はありますか。"},{role:"staff",english:"Yes. Look for the green labels.",japanese:"はい。緑の表示をご覧ください。"},{role:"learner",english:"Great, thank you.",japanese:"よかった、ありがとうございます。"}], preview:[{english:"Just one, please.",japanese:"1人です"},{english:"Could I sit by the window?",japanese:"窓側に座れますか"},{english:"Where can I get coffee?",japanese:"コーヒーはどこですか"},{english:"Do you have any vegetarian dishes?",japanese:"ベジタリアン料理はありますか"}], reactions:basic, vocabulary:[{term:"buffet",japanese:"ビュッフェ",example:"The buffet is over there."},{term:"self-service",japanese:"セルフサービス",example:"Coffee is self-service."},{term:"dish",japanese:"料理",example:"This is a local dish."}] },
  { id:"hallway", title:"清掃スタッフと廊下で雑談", icon:"👋", start:"ホテルの廊下で清掃スタッフと顔を合わせ、Good morning. How are you? と挨拶されるところ", goal:"身近な質問を交わし、聞き返しにも答えて、感じよく会話を終える", stages:["挨拶と近況を交わす","相手に質問して自分のことも答える","お礼を言って別れる"], story:[
    {role:"staff",english:"Good morning. How are you today?",japanese:"おはようございます。今日はお元気ですか。"},
    {role:"learner",english:"I'm good, thanks. How about you?",japanese:"元気です、ありがとう。あなたはどうですか。"},
    {role:"staff",english:"I'm doing well, thank you. Are you enjoying your stay?",japanese:"元気です、ありがとう。滞在を楽しんでいますか。"},
    {role:"learner",english:"Yes, very much. Everyone here is so friendly.",japanese:"はい、とても。ここの皆さんはとても親切ですね。"},
    {role:"staff",english:"I'm glad to hear that. Where are you from?",japanese:"それはよかったです。どちらのご出身ですか。"},
    {role:"learner",english:"I'm from Japan. How about you? Are you from around here?",japanese:"日本から来ました。あなたは？この辺りのご出身ですか。"},
    {role:"staff",english:"Yes, I grew up nearby.",japanese:"はい、この近くで育ちました。"},
    {role:"learner",english:"Oh, really? How long have you worked at this hotel?",japanese:"そうなんですか。このホテルではどのくらい働いているんですか。"},
    {role:"staff",english:"For about three years. What places have you visited so far?",japanese:"3年くらいです。これまでどんな場所を訪れましたか。"},
    {role:"learner",english:"I've been to the beach and the night market. I really enjoyed both.",japanese:"ビーチとナイトマーケットに行きました。どちらもとても楽しかったです。"},
    {role:"staff",english:"That sounds nice. Well, have a great day!",japanese:"いいですね。それでは、よい一日を。"},
    {role:"learner",english:"You too. It was nice talking with you. See you around!",japanese:"あなたも。お話しできてよかったです。また会いましょう。"}
  ], preview:[
    {english:"How are you today?",japanese:"今日はお元気ですか"},
    {english:"How about you?",japanese:"あなたはどうですか"},
    {english:"Are you from around here?",japanese:"この辺りのご出身ですか"},
    {english:"How long have you worked here?",japanese:"ここではどのくらい働いていますか"},
    {english:"I'm from Japan.",japanese:"日本から来ました"},
    {english:"I've been to the beach and the night market.",japanese:"ビーチとナイトマーケットに行きました"},
    {english:"It was nice talking with you.",japanese:"お話しできてよかったです"},
    {english:"See you around!",japanese:"また会いましょう"}
  ], reactions:[{english:"Oh, really?",japanese:"そうなんですか"},{english:"I'm glad to hear that.",japanese:"それはよかったです"},{english:"That sounds nice.",japanese:"いいですね"}], vocabulary:[
    {term:"Where are you from?",japanese:"どちらのご出身ですか",example:"Where are you from?"},
    {term:"around here",japanese:"この辺り",example:"Are you from around here?"},
    {term:"grew up",japanese:"育った",example:"I grew up nearby."},
    {term:"How long have you worked",japanese:"どのくらい働いていますか",example:"How long have you worked at this hotel?"},
    {term:"so far",japanese:"これまでのところ",example:"Where have you visited so far?"},
    {term:"See you around",japanese:"またどこかで・また会いましょう",example:"See you around!"}
  ] },
  { id:"room-trouble", title:"客室のトラブル", icon:"🛏️", start:"客室からフロントへ電話し How may I help you? と応答されるところ", goal:"客室の問題を説明し、対応をお願いする", stages:["問題を説明する","部屋番号を伝える","対応を依頼する"], story:[
    {role:"staff",english:"Front desk. How may I help you?",japanese:"フロントです。ご用件をどうぞ。"},{role:"learner",english:"The air conditioner isn't working.",japanese:"エアコンが動きません。"},{role:"staff",english:"I'm sorry about that. What room are you in?",japanese:"申し訳ありません。お部屋は何号室ですか。"},{role:"learner",english:"Room 508.",japanese:"508号室です。"},{role:"staff",english:"I can send someone up in about ten minutes.",japanese:"10分ほどで担当者を向かわせます。"},{role:"learner",english:"That sounds good. Could you bring an extra towel too?",japanese:"それでお願いします。タオルも追加でもらえますか。"},{role:"staff",english:"Certainly. We'll bring one with us.",japanese:"もちろんです。一緒にお持ちします。"},{role:"learner",english:"Great, thank you. I appreciate it.",japanese:"よかった、ありがとうございます。助かります。"}], preview:[{english:"The air conditioner isn't working.",japanese:"エアコンが動きません"},{english:"There's no hot water.",japanese:"お湯が出ません"},{english:"Could you send someone up?",japanese:"誰か来てもらえますか"},{english:"Could I get an extra towel?",japanese:"タオルを追加でもらえますか"}], reactions:thanks, vocabulary:[{term:"isn't working",japanese:"動いていない",example:"The TV isn't working."},{term:"send someone up",japanese:"担当者を部屋へ向かわせる",example:"We'll send someone up."},{term:"extra",japanese:"追加の",example:"I need an extra towel."}] },
  { id:"checkout", title:"チェックアウト", icon:"🧾", start:"出発日の朝、フロントで Good morning. Checking out? と尋ねられるところ", goal:"会計し、領収書と荷物預かりを頼む", stages:["チェックアウトを伝える","請求を確認する","荷物預かりを頼む"], story:[
    {role:"staff",english:"Good morning. Checking out?",japanese:"おはようございます。チェックアウトですか。"},{role:"learner",english:"Yes. I'd like to check out, please.",japanese:"はい、チェックアウトをお願いします。"},{role:"staff",english:"Did you use anything from the minibar?",japanese:"ミニバーは利用しましたか。"},{role:"learner",english:"No, I didn't.",japanese:"いいえ。"},{role:"staff",english:"Everything is paid. Would you like a receipt?",japanese:"お支払い済みです。領収書は必要ですか。"},{role:"learner",english:"Great, thank you. Could you keep my luggage?",japanese:"よかった、ありがとう。荷物を預かってもらえますか。"},{role:"staff",english:"Of course. We'll give you a luggage tag.",japanese:"もちろんです。荷物札をお渡しします。"},{role:"learner",english:"Got it. I appreciate it.",japanese:"分かりました。助かります。"}], preview:[{english:"I'd like to check out.",japanese:"チェックアウトをお願いします"},{english:"Could I see the bill?",japanese:"請求書を確認できますか"},{english:"Could you keep my luggage?",japanese:"荷物を預かってもらえますか"},{english:"Could I get a receipt?",japanese:"領収書をもらえますか"}], reactions:thanks, vocabulary:[{term:"bill",japanese:"請求書",example:"Could I see the bill?"},{term:"receipt",japanese:"領収書",example:"Would you like a receipt?"},{term:"luggage tag",japanese:"荷物札",example:"Here is your luggage tag."}] },
];

const airportScenes: Scene[] = [
  { id:"immigration", title:"入国審査", icon:"🛂", start:"入国審査カウンターで係官に Passport, please. と言われるところ", goal:"渡航目的・滞在期間・滞在先を落ち着いて答える", stages:["パスポートを提示する","渡航目的と滞在期間を答える","滞在先と帰国予定を伝える"], story:[
    {role:"staff",english:"Good afternoon. Welcome to immigration. Passport, please.",japanese:"こんにちは。入国審査へようこそ。パスポートをお願いします。"},
    {role:"learner",english:"Sure. Here you are.",japanese:"はい、どうぞ。"},
    {role:"staff",english:"What is the purpose of your visit?",japanese:"渡航目的は何ですか。"},
    {role:"learner",english:"I'm here for sightseeing.",japanese:"観光で来ました。"},
    {role:"staff",english:"How long will you be staying?",japanese:"どのくらい滞在しますか。"},
    {role:"learner",english:"I'll be staying for seven days.",japanese:"7日間滞在します。"},
    {role:"staff",english:"What is your accommodation? Where will you be staying?",japanese:"宿泊先はどこですか。どちらに滞在しますか。"},
    {role:"learner",english:"At the Central Hotel in the city center.",japanese:"市内中心部のセントラルホテルです。"},
    {role:"staff",english:"Do you have a return ticket?",japanese:"帰りの航空券はありますか。"},
    {role:"learner",english:"Yes. My return flight is next Friday.",japanese:"はい。帰りの便は次の金曜日です。"},
    {role:"staff",english:"All right. Please look at the camera. Welcome and enjoy your stay.",japanese:"分かりました。カメラを見てください。ようこそ。滞在をお楽しみください。"},
    {role:"learner",english:"Got it. Thank you.",japanese:"分かりました。ありがとうございます。"}
  ], preview:[
    {english:"I'm here for sightseeing.",japanese:"観光で来ました"},
    {english:"I'll be staying for seven days.",japanese:"7日間滞在します"},
    {english:"I'm staying at the Central Hotel.",japanese:"セントラルホテルに滞在します"},
    {english:"My return flight is next Friday.",japanese:"帰りの便は次の金曜日です"},
    {english:"I'm visiting friends.",japanese:"友人を訪ねに来ました"},
    {english:"Could you repeat that, please?",japanese:"もう一度言ってもらえますか"}
  ], reactions:basic, vocabulary:[
    {term:"immigration",japanese:"入国審査",example:"Go through immigration."},
    {term:"purpose of your visit",japanese:"渡航目的",example:"What is the purpose of your visit?"},
    {term:"sightseeing",japanese:"観光",example:"I'm here for sightseeing."},
    {term:"stay",japanese:"滞在する",example:"How long will you stay?"},
    {term:"accommodation",japanese:"宿泊先",example:"What is your accommodation?"},
    {term:"return ticket",japanese:"帰りの航空券",example:"I have a return ticket."},
    {term:"return flight",japanese:"帰りの便",example:"My return flight is on Friday."}
  ] },
  { id:"airport-bus", title:"空港バスでホテルへ", icon:"🚌", start:"カムラン国際空港のバス案内所で係員に Where are you going? と尋ねられるところ", goal:"シェラトン・ニャチャンまでのバス、降車場所、料金を確認して乗車する", stages:["行き先を伝える","バスと降車場所を確認する","料金・荷物・所要時間を尋ねる"], story:[
    {role:"staff",english:"Hello. Where are you going?",japanese:"こんにちは。どちらまで行きますか。"},
    {role:"learner",english:"I'm going to the Sheraton Nha Trang Hotel on Tran Phu Street.",japanese:"チャンフー通りのシェラトン・ニャチャン・ホテルへ行きます。"},
    {role:"staff",english:"You can take the airport bus to central Nha Trang.",japanese:"ニャチャン中心部行きの空港バスを利用できます。"},
    {role:"learner",english:"I see. Does it stop near the Sheraton?",japanese:"なるほど。シェラトンの近くに停まりますか。"},
    {role:"staff",english:"Tell the driver your hotel. The driver will show you the best bus stop.",japanese:"運転手にホテル名を伝えてください。最寄りのバス停を教えてくれます。"},
    {role:"learner",english:"Got it. Which bus should I take?",japanese:"分かりました。どのバスに乗ればよいですか。"},
    {role:"staff",english:"Take the bus marked Nha Trang City. It leaves from platform three.",japanese:"「Nha Trang City」と表示されたバスです。3番乗り場から出ます。"},
    {role:"learner",english:"Sorry, did you say platform three?",japanese:"すみません、3番乗り場と言いましたか。"},
    {role:"staff",english:"Yes, that's right. The next bus leaves in fifteen minutes.",japanese:"はい、そのとおりです。次のバスは15分後に出ます。"},
    {role:"learner",english:"Great. How much is the fare, and can I pay by card?",japanese:"よかった。料金はいくらで、カードで払えますか。"},
    {role:"staff",english:"Please buy your ticket at that counter. They accept cash and cards.",japanese:"あちらの窓口で切符を購入してください。現金とカードが使えます。"},
    {role:"learner",english:"Thanks. Can I put my suitcase in the luggage compartment?",japanese:"ありがとう。スーツケースを荷物室に入れられますか。"},
    {role:"staff",english:"Yes. The driver will help you. Ask the driver where to get off.",japanese:"はい。運転手がお手伝いします。どこで降りるか運転手に聞いてください。"},
    {role:"learner",english:"How long does it usually take to get to the city center?",japanese:"市内中心部まで通常どのくらいかかりますか。"},
    {role:"staff",english:"It depends on traffic, so please confirm the current travel time at the counter.",japanese:"交通状況によるため、現在の所要時間は窓口で確認してください。"},
    {role:"learner",english:"All right. I appreciate your help.",japanese:"分かりました。助かりました。"}
  ], preview:[
    {english:"I'm going to the Sheraton Nha Trang Hotel.",japanese:"シェラトン・ニャチャン・ホテルへ行きます"},
    {english:"Does this bus stop near the Sheraton?",japanese:"このバスはシェラトンの近くに停まりますか"},
    {english:"Which bus should I take?",japanese:"どのバスに乗ればよいですか"},
    {english:"Where is the bus stop?",japanese:"バス乗り場はどこですか"},
    {english:"How much is the fare?",japanese:"運賃はいくらですか"},
    {english:"Can I pay by card?",japanese:"カードで支払えますか"},
    {english:"Could you tell me when to get off?",japanese:"降りるときに教えてもらえますか"},
    {english:"Can I put my suitcase under the bus?",japanese:"スーツケースをバスの下に預けられますか"}
  ], reactions:thanks, vocabulary:[
    {term:"airport bus",japanese:"空港バス",example:"Where can I catch the airport bus?"},
    {term:"platform",japanese:"乗り場・ホーム",example:"It leaves from platform three."},
    {term:"bus stop",japanese:"バス停",example:"Where is the bus stop?"},
    {term:"get off",japanese:"降りる",example:"Where should I get off?"},
    {term:"fare",japanese:"運賃",example:"How much is the fare?"},
    {term:"suitcase",japanese:"スーツケース",example:"I have one suitcase."},
    {term:"luggage compartment",japanese:"荷物室",example:"Put it in the luggage compartment."},
    {term:"travel time",japanese:"所要時間",example:"What is the travel time?"}
  ] },
  { id:"exchange", title:"空港の両替所", icon:"💱", start:"両替カウンターでスタッフが How can I help you? と尋ねるところ", goal:"金額・レート・手数料を確認して両替する", stages:["両替を頼む","レートと手数料を聞く","受取額を確認する"], story:[
    {role:"staff",english:"Hello. How can I help you?",japanese:"こんにちは。ご用件をどうぞ。"},{role:"learner",english:"I'd like to exchange 30,000 yen into dollars.",japanese:"3万円をドルに両替したいです。"},{role:"staff",english:"Today's rate is shown on the screen.",japanese:"本日のレートは画面に表示されています。"},{role:"learner",english:"I see. Is there a commission?",japanese:"なるほど。手数料はありますか。"},{role:"staff",english:"Yes, there is a five-dollar service fee.",japanese:"5ドルの手数料があります。"},{role:"learner",english:"Sorry? How much will I receive?",japanese:"すみません。受取額はいくらですか。"},{role:"staff",english:"You'll receive 185 dollars. May I see your passport?",japanese:"185ドルです。パスポートを拝見できますか。"},{role:"learner",english:"That sounds good. Here you are.",japanese:"それでお願いします。はい、どうぞ。"}], preview:[{english:"I'd like to exchange 30,000 yen.",japanese:"3万円を両替したいです"},{english:"What's today's exchange rate?",japanese:"今日の為替レートはいくらですか"},{english:"Is there a commission?",japanese:"手数料はありますか"},{english:"How much will I receive?",japanese:"受取額はいくらですか"}], reactions:basic, vocabulary:[{term:"exchange rate",japanese:"為替レート",example:"What's the exchange rate?"},{term:"commission",japanese:"手数料",example:"Is there a commission?"},{term:"receive",japanese:"受け取る",example:"How much will I receive?"}] },
  { id:"sim-shop", title:"SIM販売店", icon:"📱", start:"SIM販売カウンターで Are you looking for a SIM card? と声をかけられるところ", goal:"滞在日数と用途を伝え、プランを選ぶ", stages:["SIMを探していると伝える","用途を説明する","プランと料金を確認する"], story:[
    {role:"staff",english:"Are you looking for a SIM card?",japanese:"SIMカードをお探しですか。"},{role:"learner",english:"Yes. I need a prepaid SIM for one week.",japanese:"1週間使えるSIMが必要です。"},{role:"staff",english:"How much data do you need?",japanese:"データ量はどれくらい必要ですか。"},{role:"learner",english:"I'm not sure. I'll use maps every day.",japanese:"よく分かりません。地図を毎日使います。"},{role:"staff",english:"This ten-gigabyte plan should be enough.",japanese:"10GBのプランで足りると思います。"},{role:"learner",english:"That sounds good. How much is it?",japanese:"よさそうです。いくらですか。"},{role:"staff",english:"It's thirty dollars, including tax.",japanese:"税込み30ドルです。"},{role:"learner",english:"I see. I'll take it.",japanese:"なるほど。それにします。"}], preview:[{english:"I need a prepaid SIM for one week.",japanese:"1週間用のSIMが必要です"},{english:"How much data does it include?",japanese:"データ量はいくら含まれますか"},{english:"I'll use maps every day.",japanese:"地図を毎日使います"},{english:"I'll take this plan.",japanese:"このプランにします"}], reactions:basic, vocabulary:[{term:"prepaid SIM",japanese:"プリペイドSIM",example:"I need a prepaid SIM."},{term:"data plan",japanese:"データ通信プラン",example:"Which data plan is best?"},{term:"including tax",japanese:"税込み",example:"It's thirty dollars including tax."}] },
  { id:"sim-help", title:"SIM設定・トラブル", icon:"🛠️", start:"SIM購入後 Would you like help setting it up? と尋ねられるところ", goal:"設定を頼み、接続できない問題を説明する", stages:["設定をお願いする","接続を確認する","問題を相談する"], story:[
    {role:"staff",english:"Would you like help setting it up?",japanese:"設定をお手伝いしましょうか。"},{role:"learner",english:"Yes, please. Could you set it up for me?",japanese:"設定してもらえますか。"},{role:"staff",english:"Of course. Please unlock your phone.",japanese:"スマートフォンのロックを解除してください。"},{role:"learner",english:"Got it. Here you go.",japanese:"分かりました。どうぞ。"},{role:"staff",english:"It's connected now. Could you open a website?",japanese:"接続できました。サイトを開いてみてください。"},{role:"learner",english:"It isn't loading. What should I do?",japanese:"読み込めません。どうすればいいですか。"},{role:"staff",english:"Let me restart the phone and check again.",japanese:"再起動してもう一度確認します。"},{role:"learner",english:"Great, thank you. I appreciate it.",japanese:"よかった、ありがとうございます。助かります。"}], preview:[{english:"Could you set it up for me?",japanese:"設定してもらえますか"},{english:"It isn't connecting.",japanese:"接続できません"},{english:"What should I do?",japanese:"どうすればいいですか"},{english:"Could you check the settings?",japanese:"設定を確認してもらえますか"}], reactions:thanks, vocabulary:[{term:"set up",japanese:"設定する",example:"Can you set it up?"},{term:"connect",japanese:"接続する",example:"It isn't connecting."},{term:"restart",japanese:"再起動する",example:"Please restart your phone."}] },
];

type SceneExtension = { story: StoryTurn[]; preview: PreviewItem[]; vocabulary: VocabularyItem[] };

const sceneExtensions: Record<string, SceneExtension> = {
  checkin: { story:[
    {role:"staff",english:"Before you go, may I see your booking confirmation? We also require a credit card for the security deposit.",japanese:"最後に予約確認書を拝見できますか。また、保証金のためクレジットカードをお預かりします。"},
    {role:"learner",english:"I see. What is the deposit for?",japanese:"なるほど。保証金は何のためですか。"},
    {role:"staff",english:"It covers additional expenses such as room service or minibar charges.",japanese:"ルームサービスやミニバーなどの追加料金に備えるものです。"},
    {role:"learner",english:"Got it. When will you release the hold after checkout?",japanese:"分かりました。チェックアウト後、いつ仮押さえを解除しますか。"},
    {role:"staff",english:"Yes. It usually takes a few business days.",japanese:"はい。通常は数営業日かかります。"},
    {role:"learner",english:"That sounds fine. What time is checkout?",japanese:"それなら大丈夫です。チェックアウトは何時ですか。"},
    {role:"staff",english:"Checkout is by eleven. The elevators are around the corner on your right.",japanese:"11時までです。エレベーターは右手の角を曲がったところです。"},
    {role:"learner",english:"Perfect. I appreciate your help.",japanese:"分かりました。ご対応ありがとうございます。"},
  ], preview:[
    {english:"Could I see my booking details?",japanese:"予約内容を確認できますか"},{english:"What is the deposit for?",japanese:"保証金は何のためですか"},{english:"Will the hold be released after checkout?",japanese:"仮押さえはチェックアウト後に解除されますか"},{english:"Is everything settled?",japanese:"手続きはすべて済みましたか"},
  ], vocabulary:[
    {term:"booking confirmation",japanese:"予約確認書",example:"Could I see your booking confirmation?"},{term:"security deposit",japanese:"保証金",example:"We require a security deposit."},{term:"additional expenses",japanese:"追加料金",example:"It covers additional expenses."},{term:"minibar charge",japanese:"ミニバー利用料金",example:"There is a minibar charge."},{term:"release the hold",japanese:"カードの仮押さえを解除する",example:"We will release the hold."},
  ]},
  breakfast: { story:[
    {role:"staff",english:"Would you like coffee or tea with your breakfast?",japanese:"朝食と一緒にコーヒーか紅茶はいかがですか。"},
    {role:"learner",english:"Coffee, please. Is it included in the buffet?",japanese:"コーヒーをお願いします。ビュッフェに含まれていますか。"},
    {role:"staff",english:"Yes, regular coffee is included. Specialty coffee costs extra.",japanese:"通常のコーヒーは含まれます。特別なコーヒーは追加料金です。"},
    {role:"learner",english:"I see. Could I have some milk on the side?",japanese:"なるほど。ミルクを別添えでもらえますか。"},
    {role:"staff",english:"Certainly. Please let us know if you have any food allergies.",japanese:"もちろんです。食物アレルギーがあればお知らせください。"},
    {role:"learner",english:"Got it. Does this dish contain nuts?",japanese:"分かりました。この料理にナッツは入っていますか。"},
    {role:"staff",english:"Let me check with the kitchen for you.",japanese:"厨房に確認します。"},
    {role:"learner",english:"Thank you. I appreciate it.",japanese:"ありがとうございます。助かります。"},
  ], preview:[
    {english:"Is this included in the buffet?",japanese:"これはビュッフェに含まれていますか"},{english:"Could I have some milk on the side?",japanese:"ミルクを別添えでもらえますか"},{english:"I have a food allergy.",japanese:"食物アレルギーがあります"},{english:"Does this contain nuts?",japanese:"これにナッツは含まれていますか"},
  ], vocabulary:[
    {term:"specialty coffee",japanese:"特別な種類のコーヒー",example:"Specialty coffee costs extra."},{term:"costs extra",japanese:"追加料金がかかる",example:"Specialty coffee costs extra."},{term:"on the side",japanese:"別添えで",example:"Could I have it on the side?"},{term:"food allergies",japanese:"食物アレルギー",example:"Do you have any food allergies?"},{term:"contain",japanese:"含む",example:"Does this contain nuts?"},
  ]},
  hallway: { story:[
    {role:"staff",english:"Is there anything else I can help you find?",japanese:"ほかにお探しの場所はありますか。"},
    {role:"learner",english:"Yes. Is there an ice machine nearby?",japanese:"はい。近くに製氷機はありますか。"},
    {role:"staff",english:"There is one at the end of this hallway, beside the vending machines.",japanese:"廊下の突き当たり、自動販売機の横にあります。"},
    {role:"learner",english:"Sorry, did you say at the end of the hallway?",japanese:"すみません。廊下の突き当たりと言いましたか。"},
    {role:"staff",english:"That's right. Go straight ahead and it will be on your left.",japanese:"その通りです。まっすぐ進むと左手にあります。"},
    {role:"learner",english:"Got it. Do I need my room key to use it?",japanese:"分かりました。利用にカードキーは必要ですか。"},
    {role:"staff",english:"No, but you need your key to enter this floor after midnight.",japanese:"いいえ。ただし深夜以降この階へ入るには鍵が必要です。"},
    {role:"learner",english:"I see. Thanks for letting me know.",japanese:"なるほど。教えてくれてありがとうございます。"},
  ], preview:[
    {english:"Is there an ice machine nearby?",japanese:"近くに製氷機はありますか"},{english:"Is it at the end of the hallway?",japanese:"廊下の突き当たりですか"},{english:"Do I need my room key?",japanese:"カードキーは必要ですか"},{english:"Thanks for letting me know.",japanese:"教えてくれてありがとうございます"},
  ], vocabulary:[
    {term:"nearby",japanese:"近くに",example:"Is there one nearby?"},{term:"at the end of",japanese:"〜の突き当たりに",example:"It's at the end of the hallway."},{term:"beside",japanese:"〜の横に",example:"It's beside the elevator."},{term:"go straight ahead",japanese:"まっすぐ進む",example:"Go straight ahead."},{term:"after midnight",japanese:"深夜0時以降",example:"The door locks after midnight."},
  ]},
  "room-trouble": { story:[
    {role:"staff",english:"While we arrange that, could you check the control panel by the window?",japanese:"手配の間、窓のそばの操作パネルを確認していただけますか。"},
    {role:"learner",english:"Sure. The display is on, but no cold air is coming out.",japanese:"はい。表示はついていますが、冷たい風が出ません。"},
    {role:"staff",english:"Thank you for checking. It may need maintenance.",japanese:"確認ありがとうございます。点検が必要かもしれません。"},
    {role:"learner",english:"I see. How long will the repair take?",japanese:"なるほど。修理にはどのくらいかかりますか。"},
    {role:"staff",english:"If we cannot fix it quickly, we can offer you another room.",japanese:"すぐ直せない場合は別の部屋をご用意できます。"},
    {role:"learner",english:"That sounds good. Would the new room be on the same floor?",japanese:"それがいいです。新しい部屋は同じ階ですか。"},
    {role:"staff",english:"We will check availability and call you back shortly.",japanese:"空室を確認して、すぐ折り返します。"},
    {role:"learner",english:"Great, thank you. I appreciate your help.",japanese:"よかった、ありがとうございます。助かります。"},
  ], preview:[
    {english:"No cold air is coming out.",japanese:"冷たい風が出ません"},{english:"How long will the repair take?",japanese:"修理にはどのくらいかかりますか"},{english:"Could I move to another room?",japanese:"別の部屋へ移れますか"},{english:"Could you call me back?",japanese:"折り返し電話をもらえますか"},
  ], vocabulary:[
    {term:"control panel",japanese:"操作パネル",example:"Check the control panel."},{term:"maintenance",japanese:"保守・点検",example:"It needs maintenance."},{term:"repair",japanese:"修理",example:"How long will the repair take?"},{term:"availability",japanese:"空き状況",example:"I'll check availability."},{term:"call you back",japanese:"折り返し電話する",example:"We'll call you back."},
  ]},
  checkout: { story:[
    {role:"staff",english:"Here is your itemized bill. There is no outstanding balance. Would you like us to email the receipt as well?",japanese:"こちらが明細付き請求書です。未払い残高はありません。領収書をメールでもお送りしましょうか。"},
    {role:"learner",english:"Yes, please. Could you send it to the address on my booking?",japanese:"お願いします。予約時のアドレスへ送ってもらえますか。"},
    {role:"staff",english:"Certainly. Your deposit hold will be released automatically. If there is a refund, it will also be processed automatically.",japanese:"承知しました。保証金の仮押さえは自動的に解除されます。返金がある場合も自動的に処理されます。"},
    {role:"learner",english:"Got it. How long will the refund take?",japanese:"分かりました。返金にはどのくらいかかりますか。"},
    {role:"staff",english:"It depends on your bank, but usually three to five business days.",japanese:"銀行によりますが、通常3〜5営業日です。"},
    {role:"learner",english:"I see. Could you also arrange a taxi to the airport?",japanese:"なるほど。空港までのタクシーも手配できますか。"},
    {role:"staff",english:"Of course. It should arrive in about ten minutes.",japanese:"もちろんです。10分ほどで到着します。"},
    {role:"learner",english:"Perfect. I appreciate it.",japanese:"助かります。ありがとうございます。"},
  ], preview:[
    {english:"Could you email the receipt?",japanese:"領収書をメールで送ってもらえますか"},{english:"How long will the refund take?",japanese:"返金にはどのくらいかかりますか"},{english:"Could you arrange a taxi?",japanese:"タクシーを手配してもらえますか"},{english:"Is there anything else to pay?",japanese:"ほかに支払いはありますか"},
  ], vocabulary:[
    {term:"itemized bill",japanese:"明細付き請求書",example:"Could I get an itemized bill?"},{term:"outstanding balance",japanese:"未払い残高",example:"There is no outstanding balance."},{term:"refund",japanese:"返金",example:"How long will the refund take?"},{term:"business day",japanese:"営業日",example:"It takes three business days."},{term:"arrange a taxi",japanese:"タクシーを手配する",example:"Could you arrange a taxi?"},
  ]},
  exchange: { story:[
    {role:"staff",english:"Would you prefer large bills, small bills, or a mix?",japanese:"高額紙幣、小額紙幣、または混ぜたもののどれがよいですか。"},
    {role:"learner",english:"A mix would be helpful, please.",japanese:"混ぜてもらえると助かります。"},
    {role:"staff",english:"Certainly. Please count the money before you leave the counter.",japanese:"承知しました。カウンターを離れる前に金額をご確認ください。"},
    {role:"learner",english:"Got it. Could I have a receipt as well?",japanese:"分かりました。領収書ももらえますか。"},
    {role:"staff",english:"Of course. The exchange rate and service fee are listed here.",japanese:"もちろんです。為替レートと手数料はこちらに記載されています。"},
    {role:"learner",english:"I see. Can I exchange the money back if I have some left?",japanese:"なるほど。余った場合、元の通貨へ戻せますか。"},
    {role:"staff",english:"Yes, but the rate may be different when you exchange it back.",japanese:"はい。ただし再両替時のレートは異なる場合があります。"},
    {role:"learner",english:"That makes sense. Thank you.",japanese:"分かりました。ありがとうございます。"},
  ], preview:[
    {english:"Could I have a mix of bills?",japanese:"紙幣を混ぜてもらえますか"},{english:"Could I have some smaller bills?",japanese:"小額紙幣を混ぜてもらえますか"},{english:"Could I get a receipt?",japanese:"領収書をもらえますか"},{english:"Can I exchange it back?",japanese:"元の通貨へ戻せますか"},
  ], vocabulary:[
    {term:"large bill",japanese:"高額紙幣",example:"Do you want large bills?"},{term:"small bill",japanese:"小額紙幣",example:"Could I have small bills?"},{term:"a mix",japanese:"混ぜたもの",example:"A mix would be helpful."},{term:"count the money",japanese:"金額を数える",example:"Please count the money."},{term:"exchange it back",japanese:"元の通貨へ再両替する",example:"Can I exchange it back?"},
  ]},
  "sim-shop": { story:[
    {role:"staff",english:"Would you like a physical SIM or an eSIM?",japanese:"物理SIMとeSIMのどちらがよいですか。"},
    {role:"learner",english:"I'm not sure. Does my phone support eSIM?",japanese:"よく分かりません。私の携帯はeSIMに対応していますか。"},
    {role:"staff",english:"Let me check the model. Yes, it is compatible.",japanese:"機種を確認します。はい、対応しています。"},
    {role:"learner",english:"I see. Can I keep my current phone number?",japanese:"なるほど。現在の電話番号はそのまま使えますか。"},
    {role:"staff",english:"Your regular number stays active, but this plan is data-only.",japanese:"元の番号はそのままですが、このプランはデータ通信専用です。"},
    {role:"learner",english:"Got it. Can I add more data if I run out?",japanese:"分かりました。使い切ったらデータを追加できますか。"},
    {role:"staff",english:"Yes. You can top up online at any time.",japanese:"はい。いつでもオンラインで追加購入できます。"},
    {role:"learner",english:"That sounds good. I'll take this eSIM data plan.",japanese:"よさそうです。このeSIMデータ通信プランにします。"},
  ], preview:[
    {english:"Does my phone support eSIM?",japanese:"私の携帯はeSIMに対応していますか"},{english:"Is this plan data-only?",japanese:"このプランはデータ通信専用ですか"},{english:"Can I keep my phone number?",japanese:"電話番号をそのまま使えますか"},{english:"Can I top up online?",japanese:"オンラインで追加購入できますか"},
  ], vocabulary:[
    {term:"physical SIM",japanese:"物理SIMカード",example:"Do you need a physical SIM?"},{term:"eSIM",japanese:"端末内蔵型SIM",example:"My phone supports eSIM."},{term:"compatible",japanese:"対応している",example:"Your phone is compatible."},{term:"data-only",japanese:"データ通信専用",example:"This is a data-only plan."},{term:"top up",japanese:"残高・データを追加する",example:"You can top up online."},
  ]},
  "sim-help": { story:[
    {role:"staff",english:"The phone has restarted. Do you see the network bars now?",japanese:"再起動しました。電波表示は出ていますか。"},
    {role:"learner",english:"Yes, but mobile data still isn't working.",japanese:"はい。ただ、まだモバイルデータが使えません。"},
    {role:"staff",english:"Let me check the APN settings and data roaming.",japanese:"APN設定とデータローミングを確認します。"},
    {role:"learner",english:"I see. Should data roaming be turned on?",japanese:"なるほど。データローミングはオンにする必要がありますか。"},
    {role:"staff",english:"Yes, for this SIM it needs to be on. You will not be charged extra.",japanese:"はい、このSIMではオンが必要です。追加料金はかかりません。"},
    {role:"learner",english:"Got it. Could you test the connection again?",japanese:"分かりました。もう一度接続を確認してもらえますか。"},
    {role:"staff",english:"It's working now. Please keep this setup guide in case you need to set up the SIM again.",japanese:"接続できました。SIMを再設定する場合に備えて、この設定ガイドを保管してください。"},
    {role:"learner",english:"Great, thank you. I appreciate your help.",japanese:"よかった、ありがとうございます。助かりました。"},
  ], preview:[
    {english:"Mobile data isn't working.",japanese:"モバイルデータが使えません"},{english:"Should data roaming be on?",japanese:"データローミングはオンにすべきですか"},{english:"Could you test the connection?",japanese:"接続を確認してもらえますか"},{english:"Will I be charged extra?",japanese:"追加料金はかかりますか"},
  ], vocabulary:[
    {term:"network bars",japanese:"電波強度の表示",example:"Do you see the network bars?"},{term:"mobile data",japanese:"モバイルデータ通信",example:"Mobile data isn't working."},{term:"APN settings",japanese:"APN設定",example:"Check the APN settings."},{term:"data roaming",japanese:"データローミング",example:"Turn on data roaming."},{term:"setup guide",japanese:"設定ガイド",example:"Keep the setup guide."},
  ]},
};

for (const scene of [...hotelScenes, ...airportScenes]) {
  const extension = sceneExtensions[scene.id];
  if (extension) {
    scene.story.push(...extension.story);
    scene.preview.push(...extension.preview);
    scene.vocabulary.push(...extension.vocabulary);
  }
}

function enforceVocabularyInDialogue(scenes: Scene[]) {
  for (const scene of scenes) {
    const dialogue = scene.story.map((turn) => turn.english.toLowerCase()).join(" ");
    const unused = scene.vocabulary
      .map((item) => item.term)
      .filter((term) => !dialogue.includes(term.toLowerCase()));

    if (unused.length > 0) {
      throw new Error(
        `Scene "${scene.title}" has vocabulary missing from its dialogue: ${unused.join(", ")}`,
      );
    }
  }
}

// Every WORDS & PHRASES item must be encountered in the example dialogue.
// This intentionally fails development and production builds when a new scene breaks the rule.
enforceVocabularyInDialogue([...hotelScenes, ...airportScenes]);

export const SCENARIOS: Record<string, Scenario> = {
  hotel: { id:"hotel", title:"ホテル", place:"ホテル内", scenes:hotelScenes },
  airport: { id:"airport", title:"空港", place:"空港の到着ロビー", scenes:airportScenes },
};

export function realtimeInstructions(user: UserProfile, scenario: Scenario, scene: Scene) {
  const d = user.difficulty;
  const pace = d.speed <= 2 ? "Use one very short question per turn and clear pauses." : d.speed <= 4 ? "Use short sentences with clear pauses." : d.speed <= 6 ? "Use concise sentences and relaxed delivery." : "Use natural everyday phrasing.";
  return `You are a natural staff member roleplaying with ${user.conversationName}, a Japanese learner. Address them as ${user.conversationName} only if needed. Never call them ${user.name}.
LANGUAGE: Only English and Japanese are permitted. Speak English during roleplay; use brief Japanese only when explicitly needed. Never use Chinese, Korean, or another language. If recognition suggests another language, assume an error and ask: "Could you say that again?" If the learner speaks Japanese, give one short English equivalent and continue in English.
ROLEPLAY: Stay in character. This is a realistic encounter, not a lesson or quiz. Do not praise every answer, teach proactively, mention settings, or tell the learner to change speed. Correct only communication-blocking mistakes in one short phrase, then continue. The learner may say "わからない" or "パス". Create natural opportunities for: ${scene.reactions.map((item) => item.english).join(", ")}.
START FRESH: ${scene.start}. Location: ${scenario.title} — ${scene.title}. Goal: ${scene.goal}. Natural beats: ${scene.stages.join("; ")}. Never treat this as a continuation. Difficulty 1-10: speed ${d.speed}, reductions ${d.reductions}, listening ${d.listening}. ${pace} Keep turns brief and wait for the learner.`;
}

export function realtimeSpeechSpeed(level: number) {
  const speeds = [0.6, 0.66, 0.72, 0.78, 0.84, 0.92, 1.0, 1.1, 1.2, 1.3];
  return speeds[Math.max(1, Math.min(10, Math.round(level))) - 1];
}

export function projectInstructions(user: UserProfile) {
  return `あなたは${user.conversationName}の旅行英会話の相手です。

Trip Talkから渡される場面、例文、難易度、練習モードに従い、現実のスタッフとして短い一言ずつ会話してください。英語中心で、日本語は本人が困ったときだけ短く使います。英語と日本語以外は使いません。日本語回答、「わからない」、パスを認め、重大で会話が通じない間違いだけ短く直してください。先生のような説明や過度な称賛、進級判定はしません。

「例文どおり」は相手役のセリフと順番を例文に沿わせ、本人に一字一句同じ回答は強制しません。「変化あり」は場面と範囲を変えず、質問の言い方や順番だけを少し変え、難しい話題へ広げません。

指示書を受け取った直後は「準備できました」とだけ答え、Voice開始後または本人が「Start」と言ったら始めてください。同じチャットでは同じ場面を毎回最初から練習し、前回の課題を自然に再登場させます。

本人が「練習終了」と言ったら、日本語で「第○周（練習モード）」「総評：2〜3文」「次回の課題：1文」だけを出してください。例文どおりでは重要表現を使えたか、変化ありでは異なる聞き方を理解して目的を伝えられたかを見ます。例文と違う表現を使っただけで誤りにしません。細かな採点や発音評価はしません。`;
}

export function chatGptInstructions(user: UserProfile, scenario: Scenario, scene: Scene, mode: PracticeMode) {
  const d = user.difficulty;
  const pace = d.speed <= 2 ? "英語はかなりゆっくり、短い一文ずつ、文の間を十分に空けて話してください。" : d.speed <= 4 ? "英語はゆっくり、短い文と明瞭な間で話してください。" : d.speed <= 6 ? "英語は落ち着いた自然な速さで話してください。" : "英語は自然な会話速度で話してください。";
  const example = scene.story.map((line) => `${line.role === "staff" ? "Staff" : user.conversationName}: ${line.english}`).join("\n");
  const modeInstruction = mode === "scripted"
    ? "相手役のセリフと会話の順番を例文に沿って進めてください。私には一字一句同じ回答を強制せず、意味が通じれば続けてください。"
    : "場面と練習範囲は変えず、質問の言い方や順番だけを少し変えてください。例文にない難しい話題へ広げないでください。";
  const reviewCriterion = mode === "scripted" ? "重要表現を使えたか" : "異なる聞き方を理解し、目的を自分の言葉で伝えられたか";
  const modeLabel = mode === "scripted" ? "例文どおり" : "変化あり";
  return `これから旅行英会話のロールプレイをします。あなたは${scenario.title}の「${scene.title}」にいる現地スタッフ、私は${user.conversationName}です。\n\n【開始】${scene.start}。毎回ここから新しい会話として始め、前回の続きにはしないでください。\n【目的】${scene.goal}\n【流れの目安】${scene.stages.join(" → ")}\n【練習モード】${modeLabel}。${modeInstruction}\n【話し方】${pace} リンキング・省略の強さは10段階中${d.reductions}、聞き取り難度は10段階中${d.listening}を目安にしてください。\n\n【予習した会話例】\n${example}\n\n【会話ルール】現実のスタッフとして自然に振る舞い、一度に短く話して私の返答を待ってください。先生のような説明や過度な称賛は不要です。英語と日本語以外は使わないでください。重大で会話が通じない間違いだけ短く直してください。日本語、「わからない」、「パス」も受け付け、自然な短い英語を一つ示して続けてください。${scene.reactions.map((item) => item.english).join(" / ")} を使える機会も作ってください。\n\nまず「準備できました」とだけ答えてください。Voice開始後または私が「Start」と言ったら、スタッフの最初の一言から始めてください。私が「練習終了」と言ったら会話を止め、このチャット内の周回数を数えて、日本語で「第○周（${modeLabel}）」「総評：2〜3文」「次回の課題：1文」だけを出してください。総評では${reviewCriterion}を見てください。例文と違う表現を使っただけで誤りにせず、細かな採点、長い解説、発音評価、進級判定はしないでください。`;
}
