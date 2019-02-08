package models;

public class Result {
    public Climbing seqClimbing, parClimbing, oparClimbing;

    public Result(){
        this.seqClimbing = new Climbing();
        this.parClimbing = new Climbing();
        this.oparClimbing = new Climbing();
    }

    @Override
    public String toString() {
        return "Sequential \n " + seqClimbing
                + " \n\n\n Parralel " + parClimbing
                + " \n\n\n Optimum Parralel " + oparClimbing + "\n";
    }
}
