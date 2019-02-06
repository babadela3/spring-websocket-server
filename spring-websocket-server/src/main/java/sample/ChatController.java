package sample;

import commands.StreamParser;
import models.Result;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.DestinationVariable;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import commands.StreamGobbler;


/*
 * Chat Controller listens for chat topic and responds with a message.
 *
 * @Author Jay Sridhar
 */
@Controller
public class ChatController 
{
    @MessageMapping("/chat/{noProcs}")
    @SendTo("/topic/messages")
    public Result send(@DestinationVariable("noProcs") Integer noProcs, Message message) throws Exception
    {
        Result result = new Result();
        try{
            String mpiexec = "D:\\Programs\\MPI\\Bin\\mpiexec ";
            String command = mpiexec +  "-n " + noProcs + " Geometrica.exe " + noProcs;
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("cmd /c " + command );

            // any error message?
            StreamGobbler errorGobbler = new
                    StreamGobbler(proc.getErrorStream(), "ERROR");
            errorGobbler.start();

            // parse output
            StreamParser outputParser = new StreamParser(proc.getInputStream());
            result = outputParser.parse();

            System.out.println(result);



            int exitVal = proc.waitFor();
            System.out.println("Process exitValue: " + exitVal);

        }
        catch (Throwable t){
            t.printStackTrace();
        }
        return result;
//	    return new OutputMessage(message.getFrom(), message.getText(), topic);
    }
}
