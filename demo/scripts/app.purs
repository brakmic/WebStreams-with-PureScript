module DemoApp.WebStreams where

import Prelude                       (Unit, bind)
import Data.Maybe                    (..)
import Control.Monad.Eff             (Eff)
import Control.Monad.Eff.Console     (CONSOLE())
import API.Web.Streams               (..)

-- | Callback which will be passed to the effectful `read` function
-- | Every chunk from the stream will be logged to the console
callback :: forall e. Result -> Eff (console :: CONSOLE | e) Unit
callback = \result -> do
                      logRaw result

main :: forall e. Eff (console :: CONSOLE, webStreamM :: WebStreamM, anyError :: AnyError | e) Unit
main = do
       -- | Create a new TextDecoder with UTF8
       -- | See also: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
       decoder <- getDecoder (Just "utf8") (Just { fatal : true })
       -- | Pass Callback and TextDecoder to `read`
       read "https://html.spec.whatwg.org/" callback (Just decoder)