package sample;

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
    @MessageMapping("/chat/{topic}")
    @SendTo("/topic/messages")
    public OutputMessage send(@DestinationVariable("topic") String topic,
			      Message message) throws Exception
    {
        try{
            String mpiexec = "D:\\Programs\\MPI\\Bin\\mpiexec";
            String command = mpiexec +  " Geometrica.exe";
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("cmd /c " + command );

            // any error message?
            StreamGobbler errorGobbler = new
                    StreamGobbler(proc.getErrorStream(), "ERROR");

            // any output?
            StreamGobbler outputGobbler = new
                    StreamGobbler(proc.getInputStream(), "OUTPUT");

            outputGobbler.start();
            errorGobbler.start();

            int exitVal = proc.waitFor();
            System.out.println("Process exitValue: " + exitVal);

        }
        catch (Throwable t){
            t.printStackTrace();
        }
	    return new OutputMessage(message.getFrom(), message.getText(), topic);
    }
}
