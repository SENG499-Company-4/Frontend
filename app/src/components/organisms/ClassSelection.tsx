import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import React from "react";
import SectionTimeSelection from "./SectionTimeSelection";


function ClassSelection(props: {
  className: string;

  //fieldChanged: (fieldId: string, type: string, value: string) => void;
}) {



  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{props.className}</Typography>
      </AccordionSummary>
      <AccordionDetails>

        <SectionTimeSelection />

      </AccordionDetails>
    </Accordion>
  )

}


export default ClassSelection;