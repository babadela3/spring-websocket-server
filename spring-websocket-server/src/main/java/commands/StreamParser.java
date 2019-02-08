package commands;

import models.Climber;
import models.Climbing;
import models.Result;
import models.Status;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class StreamParser {
    InputStream is;
    Result result = new Result();

    public StreamParser(InputStream is)
    {
        this.is = is;
    }

    public void parseLine(String line){
        String[] words = line.split("\\s+");
        switch (words.length){
            case 1: //instantiate an array of climbers
//                try{
//                    Integer worldSize = Integer.parseInt(words[0]);
//                    this.result = new Result();
//                    this.result.seqClimbing = new Climbing(worldSize);
//                    this.result.parClimbing = new Climbing(worldSize);
//                }
//                catch (NumberFormatException ex){
//                    ex.printStackTrace();
//                }
                break;
            case 2: // read duration

                try{
                    // if sequential ended
                    if(words[0].equals("FS")){
                        this.result.seqClimbing.duration = Float.parseFloat(words[1]);
                    }
                    // if parralel ended
                    else {
                        if(words[0].equals("FP")){
                            this.result.parClimbing.duration = Float.parseFloat(words[1]);
                        }
                        else{
                            if(words[0].equals("FOP")){
                                this.result.oparClimbing.duration = Float.parseFloat(words[1]);
                            }
                        }
                    }
                }
                catch (NumberFormatException ex){
                    ex.printStackTrace();
                }

                break;
            case 3: // read status of climber
                try{
                    Integer climberIndex = Integer.parseInt(words[0]);
//                    Float score = Float.parseFloat(words[0]);
                    Float x = Float.parseFloat(words[1]);
                    Float y = Float.parseFloat(words[2]);
                    Status status = new Status(10f, x, y);
                    if(this.result.parClimbing.climbers.containsKey(climberIndex)){
                        this.result.parClimbing.climbers.get(climberIndex).history.add(status);
                    }
                    else{
                        Climber climber = new Climber();
                        climber.history.add(status);
                        this.result.parClimbing.climbers.put(climberIndex, climber);
                    }

                }
                catch (NumberFormatException ex){
                    ex.printStackTrace();
                }
                break;
            case 4: //best score
                try{
                    Float score = Float.parseFloat(words[1]);
                    Float x = Float.parseFloat(words[2]);
                    Float y = Float.parseFloat(words[3]);
                    Status status = new Status(score, x, y);
                    //best score for sequential
                    if(words[0].equals("BS")){
                        this.result.seqClimbing.bestPoint = status;
                    }
                    else {
                        if(words[0].equals("BP")){
                            this.result.parClimbing.bestPoint = status;
                        }
                        else{
                            if(words[0].equals("BOP")){
                                this.result.oparClimbing.bestPoint = status;
                            }
                        }
                    }
                }
                catch (NumberFormatException ex){
                    ex.printStackTrace();
                }
                break;
            default:
                System.out.println("\nFormat unkown ! \n");
                break;
        }
    }

    public Result parse()
    {
        try
        {
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line=null;
            while ( (line = br.readLine()) != null){
                this.parseLine(line);
            }

        } catch (IOException ioe)
        {
            ioe.printStackTrace();
        }
        return this.result;
    }
}
