module API.Web.Streams where

import Prelude                       (Unit, bind)
import Control.Monad.Eff             (Eff)
import Control.Monad.Eff.Console     (CONSOLE())

-- | WebStream Nomenclature
foreign import data WebStreamM     :: !
foreign import data Response       :: * -- as defined by the `fetch` spec [https://fetch.spec.whatwg.org/#response-class]
foreign import data Body           :: * -- from response.body
foreign import data Reader         :: * -- from response.body.getReader()
foreign import data Result         :: *
foreign import data ReadableStream :: *
-- | The WebStream Effect
type WebStreamEff a = forall e. Eff (webStreamM :: WebStreamM | e) a

-- | Logging helper
foreign import logRaw :: forall a e. a -> Eff (console :: CONSOLE | e) Unit

type ProcessResultCallback = forall e. Result -> Eff (console :: CONSOLE | e) Unit

-- | WebStreams API
foreign import read   :: String -> ProcessResultCallback -> WebStreamEff Unit