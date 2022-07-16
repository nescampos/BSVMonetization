// Creator: Néstor Campos (https://github.com/nescampos)
// Version: 1.0

class BSVMonetization {

    

    constructor() {
        this.total = 0;
        this.scale = 0;
        this.assetCode = null;
        this.classExclusiveContent = null;
        this.classHiddenContent = null;
        this.pointer = null;
        this.privateKey = null;

    }


    /*
        Function name: isBrowserEnabled
        Description: Returns a boolean value specifying if WebMonetization is enabled or not in the browser.
        Parameters: none
        Returns: boolean
    */
    isBrowserEnabled() {
        if (document.monetization === undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    /*
        Function name: getMonetizationState
        Description: Returns a string value specifying state if WebMonetization is enabled or "Not enabled in this browser" if not enabled.
        Parameters: none
        Returns: string
    */
    getMonetizationState() {
        if (this.isBrowserEnabled()) {
            return document.monetization.state;
        }
        else {
            return "Not enabled in this browser";
        }
    }

    /*
        Function name: registerMonetizedContent
        Description: Register classes for exclusive and hidden content when WebMonetization is in use.
        Parameters: (classExclusiveContent: string, class name with exclusive content), (classHiddenContent: string, class name with hidden content when WebMonetization is enabled and disabled)
        Returns: none
    */
    registerMonetizedContent(classExclusiveContent, classHiddenContent){
        this.classExclusiveContent = classExclusiveContent;
        this.classHiddenContent = classHiddenContent;
    }

    /*
        Function name: start
        Description: Creates meta tag for WebMonetization and call a function if specified.
        Parameters: (pointer: string, pointer address of creator), (callbackFunction [optional]: funcion for calling after starting WebMonetization)
        Returns: none
    */
    start(pointer,callbackFunction) {
        if(pointer === null || pointer === undefined) {
            throw new ReferenceError("pointer is required");
        }
        const monetizationTag = document.querySelector('meta[name="monetization"]');
        if (!monetizationTag) {
            var meta = document.createElement('meta');
            meta.name = "monetization";
            this.pointer = pointer;
            meta.content = pointer;
            document.getElementsByTagName('head')[0].appendChild(meta);
            if(this.isBrowserEnabled()){
                if(this.classExclusiveContent){
                    document.monetization.addEventListener('monetizationstart', () => {
                        document.getElementsByClassName(this.classExclusiveContent).classList.remove(this.classHiddenContent)
                      });
                    document.monetization.addEventListener('monetizationstop', () => {
                        document.getElementsByClassName(this.classExclusiveContent).classList.add(this.classHiddenContent)
                      });
                }
                
                document.monetization.addEventListener('monetizationprogress',  ev => {
                    if (this.total === 0) {
                        this.scale = ev.detail.assetScale;
                        this.assetCode = ev.detail.assetCode;
                    }
                    this.total += Number(ev.detail.amount);
                  });
            }
            
        }
        if(callbackFunction){
            callbackFunction();
        }
    }

    /*
        Function name: isPendingState
        Description: Returns a boolean value specifying if WebMonetization is in "pending" state.
        Parameters: none
        Returns: boolean
    */
    isPendingState() {
        return this.isBrowserEnabled() && document.monetization.state === 'pending';
    }

    /*
        Function name: isStartedState
        Description: Returns a boolean value specifying if WebMonetization is in "started" state.
        Parameters: none
        Returns: boolean
    */
    isStartedState() {
        return this.isBrowserEnabled() && document.monetization.state === 'started';
    }

    /*
        Function name: isStoppedState
        Description: Returns a boolean value specifying if WebMonetization is in "stopped" state.
        Parameters: none
        Returns: boolean
    */
    isStoppedState() {
        return this.isBrowserEnabled() && document.monetization.state === 'stopped';
    }

    /*
        Function name: isStoppedState
        Description: Returns a boolean value specifying if WebMonetization is undefined (not enabled in browser).
        Parameters: none
        Returns: boolean
    */
    isUndefinedState() {
        return document.monetization === undefined;
    }

    
    /*
        Function name: changePointer
        Description: Change meta tag for WebMonetization with new pointer and call a function if specified.
        Parameters: (pointer: string, pointer address of creator), (createIfNotExist: boolea, creates meta tag if not exists),(callbackFunction [optional]: funcion for calling after starting WebMonetization)
        Returns: none
    */
    changePointer(pointer, createIfNotExist = false,callbackFunction) {
        if(pointer === null || pointer === undefined) {
            throw new ReferenceError("pointer is required");
        }

        const monetizationTag = document.querySelector('meta[name="monetization"]');
        if (monetizationTag) {
            this.pointer = pointer;
            monetizationTag.content = pointer;
            if(callbackFunction){
                callbackFunction();
            }
        }
        else {
            if(createIfNotExist) {
                this.start(pointer,callbackFunction);
            }
        }
    }

    /*
        Function name: registerStartListener
        Description: add listener to monetizationstart event.
        Parameters: (listenerFunction: function)
        Returns: none
    */
    registerStartListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationstart', () => {
                listenerFunction()
            });
        }
    }

    /*
        Function name: registerProgressListener
        Description: add listener to monetizationprogress event.
        Parameters: (listenerFunction: function)
        Returns: none
    */
    registerProgressListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationprogress',  ev => {
                listenerFunction();
              });
              
        }
    }

    /*
        Function name: getTotalAmountFromCurrentUser
        Description: return the total amount got from current user
        Parameters:
        Returns: Number
    */
    getTotalAmountFromCurrentUser(){
        return this.total;
    }

    /*
        Function name: getScaleFromCurrentUser
        Description: return the scale for payment from current user
        Parameters:
        Returns: Number
    */
    getScaleFromCurrentUser(){
        return this.scale;
    }

    /*
        Function name: getCurrentPointer
        Description: return the wallet pointer for payment
        Parameters:
        Returns: string
    */
    getCurrentPointer(){
        return this.pointer;
    }

    /*
        Function name: getAssetCodeFromCurrentUser
        Description: return the asset code for payment from current user
        Parameters:
        Returns: String
    */
    getAssetCodeFromCurrentUser(){
        return this.assetCode;
    }

    /*
        Function name: registerStopListener
        Description: add listener to monetizationstop event.
        Parameters: (listenerFunction: function)
        Returns: none
    */
    registerStopListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationstop', () => {
                listenerFunction()
            });
        }
    }

    /*
        Function name: registerPendingListener
        Description: add listener to monetizationpending event.
        Parameters: (listenerFunction: function)
        Returns: none
    */
    registerPendingListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationpending', () => {
                listenerFunction()
            });
        }
    }

    /*
        Function name: executeOnUndefined
        Description: execute a function if WebMonetization is undefined in web browser.
        Parameters: (callbackFunction: function)
        Returns: none
    */
    executeOnUndefined(callbackFunction) {
        if (this.isUndefinedState()) {
            callbackFunction();
        }
    }

    /*
        Function name: stop
        Description: Remove WebMonetization for web page.
        Parameters: (callbackFunction [optional]: funcion for calling after stop WebMonetization)
        Returns: none
    */
    stop(utxo, callbackFunction) {
        const monetizationTag = document.querySelector('meta[name="monetization"]')
        if (monetizationTag) {
            
            const transaction = new nimble.Transaction()
                .from(utxo)
                .to(monetizationTag.content, this.total)
                .sign(this.privateKey)

            const rawtx = transaction.toString();

            this.total = 0;
            monetizationTag.remove();
            if(callbackFunction){
                callbackFunction();
            }
            const transactionFromString = nimble.Transaction.fromString(rawtx)
            return transactionFromString.hash;
        }
    }

    /*
        Function name: enableMonetizationOniFrame
        Description: Enables WebMonetization in an iFrame.
        Parameters: (iframeId: string, iFrame id for identifiying)
        Returns: none
    */
    enableMonetizationOniFrame(iframeId){
        var iFrameToEnable = document.getElementById(iframeId);
        if(iFrameToEnable){
            iFrameToEnable.allow = "monetization";
        }
    }

    /*
        Function name: disableMonetizationOniFrame
        Description: Disables WebMonetization in an iFrame.
        Parameters: (iframeId: string, iFrame id for identifiying)
        Returns: none
    */
    disableMonetizationOniFrame(iframeId){
        var iFrameToEnable = document.getElementById(iframeId);
        if(iFrameToEnable){
            iFrameToEnable.removeAttribute("allow");
        }
    }
}