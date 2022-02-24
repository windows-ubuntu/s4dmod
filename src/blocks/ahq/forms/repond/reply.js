import  * as Blockly from "blockly";
import BaseBlockly from "blockly";
const blockName = "reply_ahq_modal_text";
const ahqcolor = ['#40BF4A', '#40BF4A', '#40BF4A', '#40BF4A'];
function listsGetRandomItem(list, remove) {
    var x = Math.floor(Math.random() * list.length);
    if (remove) {
        return list.splice(x, 1)[0];
    } else {
        return list[x];
    }
}
const BORDER_FIELDS = ["Content" , "EMBED", "BUTTON"];

const BORDER_TYPES = ["String",  "ahq_type", "ahq_button"];
const names = ["Content", "Embed", "Button (AHQ Button)"];

const blockData = {
    "message0": "Reply",
    "colour": listsGetRandomItem(ahqcolor, false),
    "mutator": "s4d_ahq_mutator_t",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
};

Blockly.Blocks[blockName] = {
    init: function() {
        this.jsonInit(blockData);
    }
};
Blockly.Blocks["s4d_ahq_mutator_t"] = {
    init: function() {
        this.setColour("#CECDCE");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
const BORDER_MUTATOR_MIXIN = {
    inputs_: [false, false, false],


    mutationToDom: function() {
        if (!this.inputs_) {
            return null;
        }
        const container = document.createElement("mutation");
        for (let i = 0; i < this.inputs_.length; i++) {
            if (this.inputs_[i]) container.setAttribute(BORDER_FIELDS[i], this.inputs_[i])
        }
        return container;
    },
    
    domToMutation: function(xmlElement) {
        for (let i = 0; i < this.inputs_.length; i++) {
            this.inputs_[i] = xmlElement.getAttribute(BORDER_FIELDS[i].toLowerCase()) == "true";
        }
        this.updateShape_();
    },

    decompose: function(workspace) {
        const containerBlock = workspace.newBlock("s4d_ahq_mutator_t");
        for (let i = 0; i < this.inputs_.length; i++) {
        BaseBlockly.Msg[BORDER_FIELDS[i]] = names[i];
        containerBlock.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(names[i])
            .appendField(new Blockly.FieldCheckbox(this.inputs_[i] ? "TRUE" : "FALSE"), BORDER_FIELDS[i].toUpperCase());
        }
        containerBlock.initSvg();
        return containerBlock;
    },

    compose: function(containerBlock) {
        // Set states
        for (let i = 0; i < this.inputs_.length; i++) {
        this.inputs_[i] = (containerBlock.getFieldValue(BORDER_FIELDS[i].toUpperCase()) == "TRUE"); 
        }
        this.updateShape_();
    },

    updateShape_: function() {
        for (let i = 0; i < this.inputs_.length; i++) {
            if (this.getInput(BORDER_FIELDS[i].toUpperCase())) this.removeInput(BORDER_FIELDS[i].toUpperCase());
        }
        for (let i = 0; i < this.inputs_.length; i++) {
            if (this.inputs_[i]) {
                BaseBlockly.Msg[BORDER_FIELDS[i]] = names[i];
                this.appendValueInput(BORDER_FIELDS[i].toUpperCase())
                .setCheck(BORDER_TYPES[i])
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(names[i]);
            }
        }
    }
};

Blockly.Extensions.registerMutator("s4d_ahq_mutator_t", BORDER_MUTATOR_MIXIN, null, [""]);
Blockly.JavaScript[blockName] = function(block) {
    let code = ["await i.reply({"];
    const Id = Blockly.JavaScript.valueToCode(block, "Content", Blockly.JavaScript.ORDER_ATOMIC);
    const Lavbel = Blockly.JavaScript.valueToCode(block, "EMBED", Blockly.JavaScript.ORDER_ATOMIC);
    const Style = Blockly.JavaScript.valueToCode(block, "BUTTON", Blockly.JavaScript.ORDER_ATOMIC) || "'SHORT'";
    if (Id) {
        code.push(`content: String(${Id}),`)
    } 
    if (Lavbel) {
    code.push(`embeds: [${Lavbel.replace("'", "").replace("'", "")}],`)
    }
    if (Style) {
    code.push(`components: [${Style.replace("'", "").replace("'", "").replace("(", "").replace(")", "")}],`)
    }
    code.push(`})`)
    return code.join("\n");
};