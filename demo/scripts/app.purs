module DemoApp.WebStreams where

import Prelude                       (Unit, bind)
import Control.Monad.Eff             (Eff)
import Control.Monad.Eff.Console     (CONSOLE())
import API.Web.Streams               (..)

-- | Callback which will be passed to the effectful `read` function
-- | Every chunk from the stream will be logged to the console
callback :: forall a e. Result -> Eff (console :: CONSOLE | e) Unit
callback = \result -> do
                      logRaw result

main :: forall e. Eff (console :: CONSOLE, webStreamM :: WebStreamM | e) Unit
main = do
       read "https://html.spec.whatwg.org/" callback