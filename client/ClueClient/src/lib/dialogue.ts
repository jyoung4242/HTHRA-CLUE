import npc2dialog from "../Dialog/npc2.json";
import floortile from "../Dialog/floortile.json";

export default class DialogManager {
  template = ``;
  left_avatar: "string" | null = null;
  right_avatar: "string" | null = null;
  state: any;
  int_handler: any;
  message: string = "";
  messageIndex: number = 0;
  letterIndex: number = 0;
  dialog: Record<string, object> = {};
  currentID: any;
  choiceFlags: any;
  endflag: boolean = false;
  messageType: string = "";
  storyflags: any = null;

  constructor(state: any) {
    this.state = state;
    this.template = `
    <div class="dialog_box" \${===dialog.isVisible}>
        <div style="width: 90%; height: 100%;position: relative;">
            <div class="left_avatar" \${===dialog.isLeft} style="background-image: url(\${dialog.leftAvatar});"></div>
            <div class="right_avatar" \${===dialog.isRight} style="background-image: url(\${dialog.rightAvatar});"></div>
            <div class="dialog" \${===dialog.isBasic}>\${dialog.message}</div>
            <div class="dialog_right" \${===dialog.isLeft}>
                \${dialog.message}
                <div class="choices" \${===dialog.isChoices}>
                    <div class="choice" \${choice<=*dialog.choices} \${click@=>dialog.choicemade} data-choice="\${choice.$index}">\${choice.message}</div>
                </div>
            </div>
            <div class="dialog_left" \${===dialog.isRight}>
                \${dialog.message}
                <div class="choices" \${===dialog.isChoices}>
                    <div class="choice" \${choice<=*dialog.choices} \${click@=>dialog.choicemade} data-choice="\${choice.$index}">\${choice.message}</div>
                </div>
            </div>
        </div>
        <div class="dialog_next" \${click@=>dialog.nextMessage}  \${===dialog.showNext}>NEXT</div>
        <div class="dialog_done" \${click@=>dialog.doneMessage} \${===dialog.showDone}>DONE</div>  
    </div>
    `;
    this.dialog["npc2dialog"] = npc2dialog;
    this.dialog["floortile"] = floortile;
  }

  /**
   * getContent
   */
  getContent(json: object) {
    //loop through keys and find first match

    for (const [key, entry] of Object.entries(json)) {
      const conditions = Object.entries(entry.conditions);

      if (key == "default") return entry.content;
      if (conditions.length) {
        let test_cntr = 0;
        conditions.forEach((cond: any) => {
          if (this.state.storyflags[cond[0]] == cond[1]) {
            test_cntr++;
          }
        });
        if (test_cntr == conditions.length) return entry.content;
      } else {
        return entry.content;
      }
    }
  }

  startDialog(dialogueID: string) {
    this.messageIndex = 0;
    this.letterIndex = 0;
    this.state.dialog.showDone = false;
    this.state.dialog.showNext = false;
    this.currentID = dialogueID;
    const messageContent = this.getContent(this.dialog[dialogueID]);
    this.state.dialog.typeSpeed = messageContent[this.messageIndex].speed;
    this.message = messageContent[this.messageIndex].message;
    this.endflag = messageContent[this.messageIndex].end;
    this.messageType = messageContent[this.messageIndex].type;
    this.storyflags = messageContent[this.messageIndex].flags;
    this.state.dialog.style = this.messageType;

    if (this.messageType == "left" || this.messageType == "left_interact") {
      this.state.dialog.leftAvatar = messageContent[this.messageIndex].avatar;
    } else if (this.messageType == "right" || this.messageType == "right_interact")
      this.state.dialog.rightAvatar = messageContent[this.messageIndex].avatar;

    if (this.messageType == "right_interact" || this.messageType == "left_interact") {
      this.state.dialog.message = "";
      this.choiceFlags = [];
      this.choiceFlags = [...messageContent[this.messageIndex].options.flags];
      this.showChoices(messageContent[this.messageIndex].options);
    } else {
      this.showMessage(this.message);
    }
    this.state.dialog.isVisible = true;
  }

  showMessage(msg: string) {
    this.int_handler = setInterval(() => {
      this.letterIndex++;
      this.state.dialog.message = msg.substring(0, this.letterIndex);

      if (this.state.dialog.message.length == this.message.length) {
        //show the next or end buttons
        if (this.endflag) {
          this.state.dialog.showDone = true;
          clearInterval(this.int_handler);
        } else {
          this.state.dialog.showNext = true;
          clearInterval(this.int_handler);
        }
        if (this.storyflags) {
          Object.entries(this.storyflags).forEach((flag: any) => {
            this.state.storyflags[flag[0]] = flag[1];
          });
        }
      }
    }, this.state.dialog.typeSpeed);
  }

  setSF(selection: any) {
    const SFindex = parseInt(selection);
    const flags = this.choiceFlags[SFindex];
    Object.entries(flags).forEach((flag: any) => {
      this.state.storyflags[flag[0]] = flag[1];
    });
  }

  nextMessage() {
    this.messageIndex++;
    this.letterIndex = 0;
    this.state.dialog.showDone = false;
    this.state.dialog.showNext = false;

    const messageContent = this.getContent(this.dialog[this.currentID]);
    this.state.dialog.typeSpeed = messageContent[this.messageIndex].speed;
    this.message = messageContent[this.messageIndex].message;
    this.endflag = messageContent[this.messageIndex].end;
    this.messageType = messageContent[this.messageIndex].type;
    this.storyflags = messageContent[this.messageIndex].flags;
    this.state.dialog.typeSpeed = messageContent[this.messageIndex].speed;
    this.state.dialog.style = this.messageType;
    if (this.messageType == "left" || this.messageType == "left_interact") {
      this.state.dialog.leftAvatar = messageContent[this.messageIndex].avatar;
    } else if (this.messageType == "right" || this.messageType == "right_interact")
      this.state.dialog.rightAvatar = messageContent[this.messageIndex].avatar;

    if (this.messageType == "right_interact" || this.messageType == "left_interact") {
      this.state.dialog.message = "";
      this.choiceFlags = [];
      messageContent[this.messageIndex].options.forEach((opt: any) => {
        this.choiceFlags.push(opt.flags);
      });
      this.showChoices(messageContent[this.messageIndex].options);
    } else {
      this.showMessage(this.message);
    }
    this.state.dialog.isVisible = true;
  }

  showChoices(choices: Array<object>) {
    this.state.dialog.choices = [...choices];
  }

  endDialog() {
    this.state.dialog.isVisible = false;
    this.messageIndex = 0;
    this.message = "";
    this.state.dialog.message = "";
    this.letterIndex = 0;
    this.state.dialog.showDone = false;
    this.state.dialog.showNext = false;
    this.currentID = "";
  }
}
