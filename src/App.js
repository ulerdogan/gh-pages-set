import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import nftcoach from "./nftcoach";

class App extends Component {
  state = {
    manager: "Lütfen Rinkeby Test Ağına Bağlanın!",
    message: "Henüz işlem yapılmadı...",
    power: "",
    rival: "",
    challengeMsg: "Lütfen bir takım id'si giriniz!",
    teams: ""
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const mngr = await nftcoach.methods.owner().call();
    const pwr = await nftcoach.methods.getTopFiveOverall(accounts[0]).call();
    const tms = await nftcoach.methods.getAllTeams().call();

    this.setState({
      manager: mngr,
      power: pwr * 5,
      teams: tms.map((tms) => <li>{tms}</li>),
    });
  }

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "İşleminizin sonuçlanması bekleniyor..." });

    if (this.state.power != "") {
      this.setState({ message: "Zaten bir takımınız var!" });
    } else {
      await nftcoach.methods.getStartingPack().send({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"),
      });

      this.setState({
        message: "Takımınız oluşturuldu. NFTCOACH dünyasına hoş geldiniz!",
      });
    }
  };

  challengeSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({
      rival: "",
      challengeMsg: "İşleminiz bekleniyor...",
    });

    await nftcoach.methods
      .makeChallenge(web3.utils.numberToHex(this.state.rival), [0, 1, 2, 3, 4])
      .send({ from: accounts[0] });

    this.setState({ challengeMsg: "Maç tamamlandı!" });
  };

  render() {
    return (
      <div>
        <h1 className="colorize">NFTCOACH.IO</h1>
        <br />
        <h3>
          <span className="colorize">{this.state.manager}</span> tarafından
          yüklenen kontrata erişiyorsunuz.
        </h3>
        <hr />
        <p>
          NFTCOACH isimli oyunumuzun ilk demo gösterimi için hazırlanmış,
          kontratın belirli fonksiyonları ile etkileşime geçmeye yarayan bir web
          arayüzüdür.
        </p>
        <p>
          Bu kontrat ile oyunumuzun takım oluşturmaya yarayan fonksiyonunu
          çağırarak 5 adet ERC-721 oyuncu tokeni elde edebilirsiniz.
        </p>
        <p>
          Elde ettiğiniz oyuncular ile diğer oyunculara meydan okuyabilirsiniz.
          Demo1 gösterimi için oyuncularınız otomatik olarak maça
          gönderilmiştir. Sıradaki demo gösteriminde oyuncularınızı seçmeniz
          gerekecektir.
        </p>
        <p>
          Yeni oyuncuları kutu açarak satın almayı sağlayan ve marketplacei
          aktifleştirecek kontrat ikinci demoda sunulacaktır.
        </p>
        <hr />
        <p>
          {" "}
          İşlem statünüz: <span className="colorize">{this.state.message}</span>
        </p>
        <hr />
        <h4>Takımınızı oluşturun ve oyuna başlayın!</h4>
        <h4>
          {" "}
          Takımınızın gücü:
          <span className="colorize">{this.state.power} / 100</span>
        </h4>
        <button onClick={this.onClick}> 1 ETHER </button>
        <hr />
        <h4>Diğer takımları görüntüleyin!</h4>
        <p>
          Rakip takım ID'leri:{" "}
          <span className="colorize">{this.state.teams}</span>
        </p>
        <hr />
        <h4>Diğer takımlara meydan okuyun!</h4>
        <h4>
          <span className="colorize">{this.state.challengeMsg}</span>
        </h4>
        <form onSubmit={this.challengeSubmit}>
          <input
            value={this.state.rival}
            onChange={(event) => this.setState({ rival: event.target.value })}
          />
          <button> CHALLENGE </button>
        </form>
      </div>
    );
  }
}

export default App;
