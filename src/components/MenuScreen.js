import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackButton from './BackButton';
import FriendsModal from './FriendsModal';
import { getUserByChatId } from '../services/userService';
import { THEME, TonConnectUIProvider, useTonConnectUI, useTonWallet, useTonConnectModal, TonConnectButton } from '@tonconnect/ui-react';

const MainScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #fff;
  width: 100%;
  font-family: 'Jost', sans-serif;
  overflow: hidden;
  touch-action: none;
`;

const Header = styled.div`
  display: flex;
  
  
  width: 90%;
  
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  font-family: Inter;
`;

const ButtonContainer = styled.div`
  position: relative;
  width: 90%;
  margin: 0.5rem 0;
  border-radius: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => (props.primary ? '#ff851b' : props.black ? '#000' : '#2d606c')};
  color: #fff;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Inter";
  font-weight: Semi Bold;
  position: relative;
  z-index: 1;
  white-space: normal; /* Allows text to wrap */
`;

const ButtonTonText = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #EF8332;
  color: black;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-family: "Inter";
  font-weight: Regular;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
  text-align: center;
  white-space: normal; /* Allows text to wrap */
`;

const ButtonStrip = styled.div`
  width: 100%;
  height: 3vh;
  background-color: #43717c;
  border-radius: 0 0 15px 15px;
  position: absolute;
  bottom: -0.7vh;
  left: 0;
  z-index: 0;
`;

const StyledTonConnectButton = styled(TonConnectButton)`
  position: absolute;
  top:2vh;
  right: 8vh;
`;

const MainScreen = ({ chatId, language }) => {
  const navigate = useNavigate();
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { open } = useTonConnectModal();

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const data = await getUserByChatId(chatId);
        setReferralCode(data.referralCode);
      } catch (error) {
        // handle error
      }
    };

    fetchReferralCode();
  }, [chatId]);

  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
  };

  const handleAboutGameClick = () => {
    navigate('/about-game');
  };

  const handleSendTransaction = () => {
    if (!wallet) {
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: "UQCH27pPReIvLzUcLkwniNbP6p9lMSHTN3nyFKWcXCaGnbka",
          amount: "1000000000", // 1 TON
        }
      ]
    };

    tonConnectUI.sendTransaction(transaction).then(() => {
      // handle success
    }).catch(error => {
      // handle error
    });
  };

  const handleDonate = () => {
    if (!wallet) {
      open();
    } else {
      handleSendTransaction();
    }
  };

  return (
    <TonConnectUIProvider
      manifestUrl="https://github.com/daanicccch/tonconnect-manifest.json/blob/main/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        includeWallets: [
          {
            "app_name": "telegram-wallet",
            "name": "Wallet",
            "image": "https://wallet.tg/images/logo-288.png",
            "about_url": "https://wallet.tg/",
            "universal_url": "https://t.me/wallet?attach=wallet",
            "bridge": [
              {
                "type": "sse",
                "url": "https://bridge.ton.space/bridge"
              }
            ],
            "platforms": ["ios", "android", "macos", "windows", "linux"]
          },
          {
            "app_name": "tonkeeper",
            "name": "Tonkeeper",
            "image": "https://tonkeeper.com/assets/tonconnect-icon.png",
            "tondns": "tonkeeper.ton",
            "about_url": "https://tonkeeper.com",
            "universal_url": "https://app.tonkeeper.com/ton-connect",
            "deepLink": "tonkeeper-tc://",
            "bridge": [
              {
                "type": "sse",
                "url": "https://bridge.tonapi.io/bridge"
              },
              {
                "type": "js",
                "key": "tonkeeper"
              }
            ],
            "platforms": ["ios", "android", "chrome", "firefox", "macos"]
          },
          {
            "app_name": "mytonwallet",
            "name": "MyTonWallet",
            "image": "https://static.mytonwallet.io/icon-256.png",
            "about_url": "https://mytonwallet.io",
            "universal_url": "https://connect.mytonwallet.org",
            "bridge": [
              {
                "type": "js",
                "key": "mytonwallet"
              },
              {
                "type": "sse",
                "url": "https://tonconnectbridge.mytonwallet.org/bridge/"
              }
            ],
            "platforms": [
              "chrome",
              "windows",
              "macos",
              "linux",
              "ios",
              "android",
              "firefox"
            ]
          },
          {
            "app_name": "openmask",
            "name": "OpenMask",
            "image": "https://raw.githubusercontent.com/OpenProduct/openmask-extension/main/public/openmask-logo-288.png",
            "about_url": "https://www.openmask.app/",
            "bridge": [
              {
                "type": "js",
                "key": "openmask"
              }
            ],
            "platforms": ["chrome"]
          },
          {
            "app_name": "tonhub",
            "name": "Tonhub",
            "image": "https://tonhub.com/tonconnect_logo.png",
            "about_url": "https://tonhub.com",
            "universal_url": "https://tonhub.com/ton-connect",
            "bridge": [
              {
                "type": "js",
                "key": "tonhub"
              },
              {
                "type": "sse",
                "url": "https://connect.tonhubapi.com/tonconnect"
              }
            ],
            "platforms": ["ios", "android"]
          },
          {
            "app_name": "dewallet",
            "name": "DeWallet",
            "image": "https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png",
            "about_url": "https://delabwallet.com",
            "universal_url": "https://t.me/dewallet?attach=wallet",
            "bridge": [
              {
                "type": "sse",
                "url": "https://sse-bridge.delab.team/bridge"
              }
            ],
            "platforms": ["ios", "android"]
          },
          {
            "app_name": "xtonwallet",
            "name": "XTONWallet",
            "image": "https://xtonwallet.com/assets/img/icon-256-back.png",
            "about_url": "https://xtonwallet.com",
            "bridge": [
              {
                "type": "js",
                "key": "xtonwallet"
              }
            ],
            "platforms": ["chrome", "firefox"]
          },
          {
            "app_name": "tonwallet",
            "name": "TON Wallet",
            "image": "https://wallet.ton.org/assets/ui/qr-logo.png",
            "about_url": "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            "bridge": [
              {
                "type": "js",
                "key": "tonwallet"
              }
            ],
            "platforms": ["chrome"]
          },
          {
            "app_name": "bitgetTonWallet",
            "name": "Bitget Wallet",
            "image": "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget_wallet_logo_0_gas_fee.png",
            "about_url": "https://web3.bitget.com",
            "deepLink": "bitkeep://",
            "bridge": [
              {
                "type": "js",
                "key": "bitgetTonWallet"
              },
              {
                "type": "sse",
                "url": "https://bridge.tonapi.io/bridge"
              }
            ],
            "platforms": ["ios", "android", "chrome"],
            "universal_url": "https://bkcode.vip/ton-connect"
          },
          {
          "app_name": "safepalwallet",
          "name": "SafePal",
          "image": "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
          "tondns":  "",
          "about_url": "https://www.safepal.com",
          "universal_url": "https://link.safepal.io/ton-connect",
          "deepLink": "safepal-tc://",
          "bridge": [ 
             {
                "type": "sse",
                "url": "https://ton-bridge.safepal.com/tonbridge/v1/bridge"
             },
             {
                "type": "js",
                "key": "safepalwallet"
             }
          ],
          "platforms": ["ios", "android", "chrome", "firefox"]
         },
          {
            "app_name": "okxTonWallet",
            "name": "OKX Wallet",
            "image": "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
            "about_url": "https://www.okx.com/web3",
            "universal_url": "https://www.okx.com/ul/uYJPB0",
            "bridge": [
              {
                "type": "js",
                "key": "okxTonWallet"
              },
              {
                "type": "sse",
                "url": "https://www.okx.com/tonbridge/discover/rpc/bridge"
              }
            ],
            "platforms": ["chrome", "safari", "firefox", "ios", "android"]
          },
          {
          "app_name": "okxTonWalletTr",
          "name": "OKX TR Wallet",
          "image": "https://static.okx.com/cdn/assets/imgs/247/587A8296F0BB640F.png",
          "about_url": "https://tr.okx.com/web3",
          "universal_url": "https://tr.okx.com/ul/uYJPB0?entityId=5",
          "bridge": [
              {
                "type": "js",
                "key": "okxTonWallet"
              },
              {
                "type": "sse",
                "url": "https://www.okx.com/tonbridge/discover/rpc/bridge"
              }
            ],
            "platforms": [
              "chrome",
              "safari",
              "firefox",
              "ios",
              "android"
            ]
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
      }}
    >
      <MainScreenContainer>
        <Header>
          <BackButton />
          <StyledTonConnectButton onClick={open} />
        </Header>
        <Logo>
          <LogoImage src="/menu-page/logo.png" alt="EcoHero Logo" />
          <Title>EcoHero</Title>
        </Logo>
        <ButtonContainer>
          <Button onClick={handleLeaderboardClick}>
            {language === 'ru' ? 'Таблица лидеров' : 'Leaderboard'}
          </Button>
          <ButtonStrip />
        </ButtonContainer>
        <ButtonContainer>
          <Button onClick={() => setIsFriendsModalOpen(true)}>
            {language === 'ru' ? 'Друзья' : 'Friends'}
          </Button>
          <ButtonStrip />
        </ButtonContainer>
        <ButtonContainer>
          <Button onClick={handleAboutGameClick}>
            {language === 'ru' ? 'Об игре' : 'About the Game'}
          </Button>
          <ButtonStrip />
        </ButtonContainer>
        <ButtonContainer>
          <ButtonTonText onClick={handleDonate}>
            {language === 'ru' ? 'Донат 1 TON' : 'Donate 1 TON'}
          </ButtonTonText>
        </ButtonContainer>
        <FriendsModal
          isOpen={isFriendsModalOpen}
          onClose={() => setIsFriendsModalOpen(false)}
          chatId={chatId}
          referralCode={referralCode}
          language={language}
        />
      </MainScreenContainer>
    </TonConnectUIProvider>
  );
};

export default MainScreen;